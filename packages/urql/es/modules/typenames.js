import { parse } from 'graphql/language/parser';
import { print } from 'graphql/language/printer';
var TYPENAME_FIELD = {
  kind: 'Field',
  name: {
    kind: 'Name',
    value: '__typename'
  }
};

function addTypename(selectionSet, isRoot) {
  if (isRoot === void 0) {
    isRoot = false;
  }

  if (selectionSet.selections) {
    if (!isRoot) {
      var exists = selectionSet.selections.some(function (selection) {
        return selection.kind === 'Field' && selection.name.value === '__typename';
      });

      if (!exists) {
        selectionSet.selections.push(TYPENAME_FIELD);
      }
    }

    selectionSet.selections.forEach(function (selection) {
      if (selection.kind === 'Field') {
        if (selection.name.value.lastIndexOf('__', 0) !== 0 && selection.selectionSet) {
          addTypename(selection.selectionSet);
        }
      } else if (selection.kind === 'InlineFragment') {
        if (selection.selectionSet) {
          addTypename(selection.selectionSet);
        }
      }
    });
  }
}

function addTypenameToDocument(doc) {
  doc.definitions.forEach(function (definition) {
    var isRoot = definition.kind === 'OperationDefinition';
    addTypename(definition.selectionSet, isRoot);
  });
  return doc;
}

export function formatTypeNames(query) {
  var doc = parse(query.query);
  return {
    query: print(addTypenameToDocument(doc)),
    variables: query.variables
  };
}
export function gankTypeNamesFromResponse(response) {
  var typeNames = [];
  getTypeNameFromField(response, typeNames);
  return typeNames.filter(function (v, i, a) {
    return a.indexOf(v) === i;
  });
}

function getTypeNameFromField(obj, typenames) {
  Object.keys(obj).map(function (item) {
    if (typeof obj[item] === 'object') {
      if (obj[item] && '__typename' in obj[item]) {
        typenames.push(obj[item].__typename);
      }

      if (obj[item]) {
        getTypeNameFromField(obj[item], typenames);
      }
    }
  });
}