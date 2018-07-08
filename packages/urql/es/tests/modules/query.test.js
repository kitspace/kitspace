import { query } from "../../modules/query";
describe('query / mutation / subscription', function () {
  it('should return a valid query object', function () {
    var val = query("{ todos { id } }");
    expect(val).toMatchObject({
      query: "{ todos { id } }",
      variables: {}
    });
  });
  it('should return a valid query object with variables', function () {
    var val = query("{ todos { id } }", {
      test: 5
    });
    expect(val).toMatchObject({
      query: "{ todos { id } }",
      variables: {
        test: 5
      }
    });
  });
});