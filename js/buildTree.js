async function buildAndPrintTree() {
    const data = await getData();
    // save our tree as an object of the window to have an ability to use it without binding
    const tree = new Tree(data);
    document.getElementById("ascending").addEventListener("click", function(){sort(true, tree)});
    document.getElementById("descending").addEventListener("click", function(){sort(false, tree)});
    document.getElementById("searchInput").addEventListener("keydown", function(){search(tree)});
    printTree(tree);
}


buildAndPrintTree();