/**Change Key */
export function defaultGetNodeKey({ treeIndex }) {
  return treeIndex;
}

// Cheap hack to get the text of a react object
function getReactElementText(parent) {
  if (typeof parent === 'string') {
    return parent;
  }

  if (
    typeof parent !== 'object' ||
    !parent.props ||
    !parent.props.children ||
    (typeof parent.props.children !== 'string' &&
      typeof parent.props.children !== 'object')
  ) {
    return '';
  }

  if (typeof parent.props.children === 'string') {
    return parent.props.children;
  }

  return parent.props.children
    .map(child => getReactElementText(child))
    .join('');
}

// Search for a query string inside a node property
function stringSearch(key, searchQuery, node, path, treeIndex) {
  if (typeof node[key] === 'function') {
    // Search within text after calling its function to generate the text
    return (
      String(node[key]({ node, path, treeIndex })).toLowerCase().indexOf(searchQuery) > -1
    );
  } else if (typeof node[key] === 'object') {
    // Search within text inside react elements
    //console.log(getReactElementText(node[key]).toLowerCase())
    return getReactElementText(node[key]).toLowerCase().indexOf(searchQuery) > -1;
  }

  // Search within string
  return node[key] && String(node[key]).toLowerCase().indexOf(searchQuery) > -1;
}

export function defaultSearchMethod({ node, path, treeIndex, searchQuery }) {
  var searchWords = searchQuery.split(" ")
  let result=true
  for (let i=0;i<searchWords.length;i++){
    searchWords[i]=searchWords[i].toLowerCase()
    result=result&&stringSearch('title', searchWords[i], node, path, treeIndex)//||stringSearch('subtitle', searchWords[i], node, path, treeIndex))
  }
  if (searchWords.length==0)
    result=false
  return (
    result
  );
}
