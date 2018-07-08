import { formatTypeNames, gankTypeNamesFromResponse } from "../../modules/typenames";
describe('formatTypeNames', function () {
  it('should add typenames to a query string', function () {
    var newQuery = formatTypeNames({
      query: "{ todos { id } }",
      variables: {}
    });
    expect(newQuery.query).toBe("{\n  todos {\n    id\n    __typename\n  }\n}\n");
  });
});
describe('gankTypeNamesFromResponse', function () {
  it('should return all typenames included in a response as an array', function () {
    var typeNames = gankTypeNamesFromResponse({
      todos: [{
        id: 1,
        __typename: 'Todo'
      }]
    });
    expect(typeNames).toMatchObject(['Todo']);
  });
});