import { EntityRepository, AbstractRepository, SelectQueryBuilder } from 'typeorm';

import { Inquest } from '../models/Inquest';
import { escapeRegex, getConcatExpression } from '../utils/sql';
import { InquestQuery, Sort } from '../utils/query';

@EntityRepository(Inquest)
export class InquestRepository extends AbstractRepository<Inquest> {
  getInquestFromId(inquestId: number): Promise<Inquest | undefined> {
    return this.createQueryBuilder('inquest')
      .innerJoinAndSelect('inquest.jurisdiction', 'jurisdiction')
      .innerJoinAndSelect('inquest.deceased', 'deceased')
      .innerJoinAndSelect('deceased.deathManner', 'deathManner')
      .innerJoinAndSelect('deceased.inquestReason', 'inquestReason')
      .innerJoinAndSelect('inquest.inquestDocuments', 'documents')
      .leftJoinAndSelect('documents.inquestDocumentLinks', 'documentLinks')
      .leftJoinAndSelect('documentLinks.documentSource', 'documentSource')
      .leftJoinAndSelect('inquest.authorities', 'authorities')
      .where('inquest.inquestId = :inquestId', { inquestId })
      .getOne();
  }

  getInquests({
    offset,
    limit,
    text,
    keywords,
    jurisdiction,
    deathCause,
    sort,
  }: InquestQuery): Promise<[Inquest[], number]> {
    // TODO: create userJurisdiction query parameter, use for ordering results.
    const query = this.createQueryBuilder('inquest')
      .innerJoinAndSelect('inquest.jurisdiction', 'jurisdiction')
      .innerJoinAndSelect('inquest.deceased', 'deceased')
      .innerJoinAndSelect('deceased.deathManner', 'deathManner')
      .innerJoinAndSelect('deceased.inquestReason', 'inquestReason')
      .take(limit)
      .skip(offset);

    if (text) this.addTextSearch(query, text);
    if (keywords && keywords.length) this.addKeywordSearch(query, keywords);
    if (jurisdiction)
      query.andWhere('jurisdiction.jurisdictionId = :jurisdiction', { jurisdiction });
    if (deathCause) query.andWhere('deceased.deathCauseId = :deathCause', { deathCause });
    if (sort) this.addSort(query, sort);

    // Ensure ordering of results is deterministic.
    query.addOrderBy('inquest.inquestId', 'ASC');

    return query.getManyAndCount();
  }

  private addTextSearch(query: SelectQueryBuilder<Inquest>, text: string) {
    const terms = text.split(/\s+/).filter((term) => term);
    if (terms.length) {
      const searchTextSubQuery = query
        .subQuery()
        .addSelect('inquest.inquestId')
        .addSelect('inquest.name')
        .addSelect('inquest.tags')
        .addSelect('deceased.lastName')
        .addSelect('deceased.givenNames')
        .addSelect('deathCause.name')
        .from('inquest', 'inquest')
        .innerJoin('inquest.deceased', 'deceased')
        .innerJoin('deceased.deathCauseModel', 'deathCause')
        .leftJoin('inquest.inquestKeywords', 'keywords')
        .addGroupBy('inquest.inquestId')
        .addGroupBy('deceased.deceasedId');
      terms.forEach((term, i) => {
        // For each search term, ensure at least 1 of several columns contains that term.
        // Match the start of the string or a non-word character followed by the search term.
        const regex = `(^|[^A-Za-z0-9])${escapeRegex(term)}`;
        searchTextSubQuery.andHaving(
          `${getConcatExpression([
            'inquest.name',
            'inquest.tags',
            'deceased.lastName',
            'deceased.givenNames',
            'deathCause.name',
            "GROUP_CONCAT(keywords.name SEPARATOR ' ')",
            "GROUP_CONCAT(keywords.synonyms SEPARATOR ' ')",
          ])} REGEXP :regexp${i}`,
          { [`regexp${i}`]: regex }
        );
      });
      // Extract inquest IDs from previous sub-query.
      const inquestIdSubQuery = query
        .subQuery()
        .select('inquest_inquestId')
        .from(searchTextSubQuery.getQuery(), 'searchTextSubQuery');
      query.andWhere(`inquest.inquestId IN ${inquestIdSubQuery.getQuery()}`);
    }
  }

  private addKeywordSearch(query: SelectQueryBuilder<Inquest>, keywords: string[]) {
    // Use sub-query to get list of inquests by ID which match all provided keywords.
    const subQuery = query
      .subQuery()
      .select('keywords.inquestId')
      .from('inquestKeywords', 'keywords')
      .where('keywords.inquestKeywordId IN (:keywords)', { keywords })
      .groupBy('keywords.inquestId')
      .having('COUNT(keywords.inquestId) >= (:totalKeywords)', { totalKeywords: keywords.length })
      .getQuery();
    query.andWhere(`inquest.inquestId IN ${subQuery}`);
  }

  private addSort(query: SelectQueryBuilder<Inquest>, sort: Sort) {
    switch (sort) {
      case Sort.Alphabetical:
        query.addOrderBy('inquest.name', 'ASC');
        break;
      case Sort.New:
        query.addOrderBy('inquest.start', 'DESC');
        break;
      case Sort.Relevant:
        query
          .addSelect("(jurisdiction.federalJurisdictionId = 'CAD')", 'isCanadian')
          .addOrderBy('inquest.isPrimary', 'DESC')
          .addOrderBy('isCanadian', 'DESC')
          .addOrderBy('inquest.start', 'DESC');
        break;
    }
  }
}
