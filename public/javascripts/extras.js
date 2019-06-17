function cpySnippet() {
    var element = document.getElementById('code-snippet');
    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    try {
        document.execCommand('copy');
        alert('Copied to clipboard');
    }
    catch (err) {
        alert('Copy failed. Please do it manually');
    }
}

function testcpy(){
    let Identifie = document.getElementById('code-snippet');
    let str = Identifie.innerText;
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    try {
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('Copied to clipboard');
    }
    catch (err) {
        alert('Copy failed. Please do it manually');
    }

}
