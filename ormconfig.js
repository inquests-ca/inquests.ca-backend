module.exports = {
  type: 'sqlite',
  database: process.env.DATABASE_FILE,
  synchronize: false,
  logging: false,
  entities: ['dist/models/**/*.js'],
  cli: { entitiesDir: 'src/models' },
};
