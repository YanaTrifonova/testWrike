function search(tree) {
    if (window.timeout !== undefined) {
        clearTimeout(window.timeout)
    }
    // setting timeout to avoid immediate search while user may be still typing
    window.timeout = setTimeout(function () {
        const hiddenBySearchClass = 'node-hiddenBySearch';
        let hiddenBySearch = document.getElementsByClassName(hiddenBySearchClass);
        while (hiddenBySearch.length !== 0) {
            hiddenBySearch[0].classList.remove(hiddenBySearchClass);
        }
        let input = document.querySelector('#searchInput').value;
        for (let node of tree.treeObject) {
            dfs(node, input, hiddenBySearchClass);
        }
    }, 100);

    function dfs(node, input, hiddenBySearchClass) {
        let anyFound = false;
        for (let i = 0; i < node.children.length; i++) {
            let isFound = dfs(node.children[i], input, hiddenBySearchClass);
            anyFound = anyFound || isFound;
        }
        let tempTitle = node.title.toLowerCase();
        let tempInput = input.toLowerCase();
        let hasSubstr = tempTitle.indexOf(tempInput) !== -1;
        if((anyFound || hasSubstr) && tempInput !== '') {
            document.getElementById(getTriangleAndTextId(node)).classList.remove(getHideCls());
            document.getElementById(getClassId(node)).classList.remove(getHideCls());
            document.getElementById(getTriangleAndTextId(node)).children[0].classList.remove(getRotateCls());
        }

        if (!hasSubstr && !anyFound) {
            document.getElementById(getTriangleAndTextId(node)).classList.add(hiddenBySearchClass);
            return false;
        }
        return true;
    }
}
