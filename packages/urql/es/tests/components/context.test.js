/* tslint:disable */
import * as exp from "../../components/context";
describe('Context', function () {
  it('should export a new react context', function () {
    expect(exp.Consumer).toBeTruthy();
    expect(exp.Provider).toBeTruthy();
  });
});