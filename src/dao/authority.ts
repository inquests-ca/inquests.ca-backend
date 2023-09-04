import { EntityRepository, AbstractRepository, SelectQueryBuilder } from 'typeorm';

import { Authority } from '../models/Authority';
import { escapeRegex, getConcatExpression } from '../utils/sql';
import { AuthorityQuery, Sort } from '../utils/query';

@EntityRepository(Authority)
export class AuthorityRepository extends AbstractRepository<Authority> {
  getAuthorityFromId(authorityId: number): Promise<Authority | undefined> {
    return this.createQueryBuilder('authority')
      .innerJoinAndSelect('authority.authorityDocuments', 'documents')
      .innerJoinAndSelect('documents.source', 'source')
      .leftJoinAndSelect('documents.authorityDocumentLinks', 'documentLinks')
      .leftJoinAndSelect('documentLinks.documentSource', 'documentSource')
      .leftJoinAndSelect('authority.authorityCitations', 'authorityCitations')
      .leftJoinAndSelect('authority.authorityCitedBy', 'authorityCitedBy')
      .leftJoinAndSelect('authority.authorityRelated', 'authorityRelated')
      .leftJoinAndSelect('authority.inquests', 'inquests')
      .where('authority.authorityId = :authorityId', { authorityId })
      .getOne();
  }

  getAuthorities({
    offset,
    limit,
    text,
    keywords,
    jurisdiction,
    sort,
  }: AuthorityQuery): Promise<[Authority[], number]> {
    // TODO: create userJurisdiction query parameter, use for ordering results.
    const query = this.createQueryBuilder('authority')
      .innerJoinAndSelect(
        'authority.authorityDocuments',
        'primaryDocument',
        'primaryDocument.isPrimary = 1'
      )
      .innerJoinAndSelect('primaryDocument.source', 'source')
      .take(limit)
      .skip(offset);

    if (text) this.addTextSearch(query, text);
    if (keywords && keywords.length) this.addKeywordSearch(query, keywords);
    if (jurisdiction) this.addJurisdictionSearch(query, jurisdiction);
    if (sort) this.addSort(query, sort);

    // Ensure ordering of results is deterministic.
    query.addOrderBy('authority.authorityId', 'ASC');

    return query.getManyAndCount();
  }

  private addTextSearch(query: SelectQueryBuilder<Authority>, text: string) {
    const terms = text.split(/\s+/).filter((term) => term);
    if (terms.length) {
      const searchTextSubQuery = query
        .subQuery()
        .addSelect('authority.authorityId')
        .addSelect('authority.name') // TODO: remove?
        .addSelect('authority.tags')
        .addSelect('primaryDocument.citation')
        .from('authority', 'authority')
        .innerJoin(
          'authority.authorityDocuments',
          'primaryDocument',
          'primaryDocument.isPrimary = 1'
        )
        .leftJoin('authority.authorityKeywords', 'keywords')
        .addGroupBy('authority.authorityId')
        .addGroupBy('primaryDocument.authorityDocumentId');
      terms.forEach((term, i) => {
        // For each search term, ensure at least 1 of several columns contains that term.
        // Match the start of the string or a non-word character followed by the search term.
        const regex = `(^|[^A-Za-z0-9])${escapeRegex(term)}`;
        searchTextSubQuery.andHaving(
          `${getConcatExpression([
            'authority.name',
            'authority.tags',
            'primaryDocument.citation',
            "GROUP_CONCAT(keywords.name SEPARATOR ' ')",
            "GROUP_CONCAT(keywords.synonyms SEPARATOR ' ')",
          ])} REGEXP :regexp${i}`,
          { [`regexp${i}`]: regex }
        );
      });
      // Extract authority IDs from previous sub-query.
      const authorityIdSubQuery = query
        .subQuery()
        .select('authority_authorityId')
        .from(searchTextSubQuery.getQuery(), 'searchTextSubQuery');
      query.andWhere(`authority.authorityId IN ${authorityIdSubQuery.getQuery()}`);
    }
  }

  private addKeywordSearch(query: SelectQueryBuilder<Authority>, keywords: string[]) {
    // Use sub-query to get list of authorities by ID which match all provided keywords.
    const subQuery = query
      .subQuery()
      .select('keywords.authorityId')
      .from('authorityKeywords', 'keywords')
      .where('keywords.authorityKeywordId IN (:keywords)', { keywords })
      .groupBy('keywords.authorityId')
      .having('COUNT(keywords.authorityId) >= (:totalKeywords)', {
        totalKeywords: keywords.length,
      });
    query.andWhere(`authority.authorityId IN ${subQuery.getQuery()}`);
  }

  private addJurisdictionSearch(query: SelectQueryBuilder<Authority>, jurisdiction: string) {
    query.andWhere((qb) => {
      const subQuery = qb
        .subQuery()
        .select('authority.authorityId')
        .from('authority', 'authority')
        .innerJoin('authority.authorityDocuments', 'documents')
        .innerJoin('documents.source', 'source')
        .where('source.jurisdictionId = :jurisdiction', { jurisdiction });
      return `authority.authorityId IN ${subQuery.getQuery()}`;
    });
  }

  private addSort(query: SelectQueryBuilder<Authority>, sort: Sort) {
    switch (sort) {
      case Sort.Alphabetical:
        query.addOrderBy('authority.name', 'ASC');
        break;
      case Sort.New:
        query.addOrderBy('primaryDocument.created', 'DESC');
        break;
      case Sort.Relevant:
        query
          .addOrderBy('authority.isPrimary', 'DESC')
          .addOrderBy('source.rank', 'DESC')
          .addOrderBy('primaryDocument.created', 'DESC');
        break;
    }
  }
}
