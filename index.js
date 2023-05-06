function getPagename(){
    // function that returns the name of the files to save
    // (this is the value/placeholder of the filename element)
    var filename = document.getElementById("filename");
    if(filename.value == ""){
        filename = filename.placeholder;
    }
    else {
        filename = filename.value;
    }
    return filename;
}

function loadPage(){
    // load the page from URL with GET parameters
    var url = new URL(document.URL);
    var params = url.searchParams;
    for(var pair of params.entries()){
        var key = pair[0];
        var val = pair[1];
        if(key.startsWith("card-")){
            var elem = document.getElementById(key);
            if(elem != null){
                elem.value = val;
            }
        }
    }
}

function savePage(){
    // create URL with GET parameters
    var params = [];
    var elems = document.querySelectorAll("*");

    for(var elem of elems){
        if(elem.id.startsWith("card-")){
            params.push(elem.id + "=" + encodeURIComponent(elem.value));
        }
    }
    params = params.join("&");
    var path = document.URL.split("?")[0] + "?" + params;
    
    // save URL with GET parameters to executable file
    var text = '<script type="text\/javascript">window.location = "' + path + '";<\/script>';
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', getPagename() + ".html");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function saveJson() {
    const url = new URL(window.location);
    const settings = {
        'card-level': url.searchParams.get('card-level'),
        'card-type': url.searchParams.get('card-type'),
        'card-name': url.searchParams.get('card-name'),
        'card-mod': url.searchParams.get('card-mod'),
        'card-text1': url.searchParams.get('card-text1'),
        'card-text2': url.searchParams.get('card-text2'),
        'card-change': url.searchParams.get('card-change'),
        'card-left': url.searchParams.get('card-left'),
        'card-right': url.searchParams.get('card-right'),
        'card-background': url.searchParams.get('card-background'),
        'card-image': window.localStorage.getItem('card-image'),
        'card-x': url.searchParams.get('card-x'),
        'card-y': url.searchParams.get('card-y'),
        'card-s': url.searchParams.get('card-s'),
    };

    // save URL with GET parameters to executable file
    var text = JSON.stringify(settings);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', getPagename() + ".json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function loadJson() {
    var elem = document.getElementById("loadJson");
    var files = elem.files;
    if(files.length > 0){
        var file = files[0];
        var reader = new FileReader();
        reader.onloadend = function(){
            var result = reader.result;

            if (!result) {
                return;
            }

            var settings = JSON.parse(result);

            const url = new URL(window.location);
            url.searchParams.set('card-level', settings['card-level']);
            url.searchParams.set('card-type', settings['card-type']);
            url.searchParams.set('card-name', settings['card-name']);
            url.searchParams.set('card-mod', settings['card-mod']);
            url.searchParams.set('card-text1', settings['card-text1']);
            url.searchParams.set('card-text2', settings['card-text2']);
            url.searchParams.set('card-change', settings['card-change']);
            url.searchParams.set('card-left', settings['card-left']);
            url.searchParams.set('card-right', settings['card-right']);
            url.searchParams.set('card-background', settings['card-background']);
            window.localStorage.setItem('card-image', settings['card-image']);
            url.searchParams.set('card-x', settings['card-x']);
            url.searchParams.set('card-y', settings['card-y']);
            url.searchParams.set('card-s', settings['card-s']);

            window.history.pushState({}, '', url);

            loadPage();
            drawImage();
        }
        reader.readAsText(file, 'UTF-8');
    }
}

function updateIcon(){
    var elem = document.getElementById("card-background");
    if(elem.value === 'Treasure'){
        // update icon and placeholders from treasure cards to door cards
        elem.value = 'Door';
        document.getElementById("card-level").placeholder = "Bonus";
        document.getElementById("card-type").placeholder = "Usable by";
        document.getElementById("card-mod").placeholder = "";
        document.getElementById("card-text1").placeholder = "Text 1";
        document.getElementById("card-text2").placeholder = "Text 2";
        document.getElementById("card-left").placeholder = "Hands";
        document.getElementById("card-right").placeholder = "Value";
    }
    else {
        // update icon and placeholders from door cards to treasure cards
        elem.value = 'Treasure';
        document.getElementById("card-level").placeholder = "Level";
        document.getElementById("card-type").placeholder = "Type";
        document.getElementById("card-mod").placeholder = "[Modify Monster]";
        document.getElementById("card-text1").placeholder = "Text";
        document.getElementById("card-text2").placeholder = "Bad Stuff";
        document.getElementById("card-left").placeholder = "Levels";
        document.getElementById("card-right").placeholder = "Treasures";
    }
}

function addImage(ctx, elem, w, h, x, y, s){
    // function that places the main image of the card
    var base64Image = window.localStorage.getItem('card-image');
    if (!base64Image) {
        return
    }

    const image = new Image();
    image.onload = function() {
        var imgW = Math.round(s*w);
        var imgH = Math.round(s*w*image.naturalHeight/image.naturalWidth);
        ctx.drawImage(image, (w-imgW)/2+Math.round(x*w/100.0), (h-imgH)/2+Math.round(y*h/100.0), imgW, imgH);
    }
    image.src = base64Image;
}

function loadImage() {
    // function that loads the image from the file input and puts it in to localstate
    var elem = document.getElementById("card-image");
    var files = elem.files;
    if(files.length > 0){
        var file = files[0];
        var reader = new FileReader();
        reader.onloadend = function(){
            var result = reader.result;

            window.localStorage.setItem('card-image', result);
        }
        reader.readAsDataURL(file);
    }
}

function convertFontSize(s){
    // convert font size to pixel size with respect to resolution
    var canvas = document.getElementById("canvas");
    return Math.round(1.0 * parseInt(canvas.width) / (parseInt(canvas.style.width.replaceAll("mm")) * 3.7795275591) * s).toString();
}

function handleSpecialChars(val){
    // handle special characters for Quasimodo font
    val = val.replaceAll("\u00e4", "\u00c4"); // ae -> AE
    val = val.replaceAll("\u00f6", "\u00d6"); // oe -> OE
    val = val.replaceAll("\u00fc", "\u00dc"); // ue -> UE
    val = val.replaceAll("\u00df", "\u1e9e"); // ss -> SS
    return val;
}

function addQuasimodoText(ctx, val, fontsize, w, start_h, space, add_space){
    // function that adds title text to the canvas
    val = handleSpecialChars(val);
    ctx.textAlign = "center";
    ctx.font = convertFontSize(fontsize) + "pt Quasimodo";
    var lines = val.split("#");
    var newline = 1.1*convertFontSize(fontsize)*1.33;
    if(space > 0){
        space = add_space;
    }
    else if(space < 0){
        space = -newline*(lines.length-1);
    }
    for(var i = 0; i < lines.length; ++i){
        lines[i] = handleSpecialChars(lines[i])
        ctx.fillText(lines[i], 0.5*w, start_h+space+newline*i, 0.9*w);
    }
    add_space += newline*(lines.length-1);
    return add_space;
}

function addCaslonAntiqueText(ctx, val, fontsize, w, start_h, space, add_space){
    // function that adds description text to the canvas
    var bi = "";
    if(val.endsWith("**")){
        bi = "bold ";
        val = val.substring(0, val.length-2);
    }
    if(val.endsWith("*")){
        bi = "italic " + bi;
        val = val.substring(0, val.length-1);
    }
    ctx.textAlign = "left";
    ctx.font = bi + convertFontSize(fontsize) + "pt CaslonAntique";
    var lines = ("   " + val).replaceAll("\r", "").replaceAll("\n\n", "\n\n   ").split("\n");
    var newline = 1.08*convertFontSize(fontsize)*1.33;
    if(space > 0){
        space = add_space;
    }
    else if(space < 0){
        space = -newline*(lines.length-1);
    }
    for(var i = 0; i < lines.length; ++i){
        ctx.fillText(lines[i], 0.1*w, start_h+space+newline*i);
    }
    add_space += newline*(lines.length-1);
    return add_space;
}

function drawImage(){
    const url = new URL(window.location);
    var canvas = document.getElementById("canvas");
    var w = canvas.width;
    var h = canvas.height;
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#270b00";
    
    var add_space = 0;

    // background image
    var val = document.getElementById("card-background").value;
    var img = new Image();
    if(val === "Door"){
        // door card
        img.src = "./resources/door.png";
    }
    else {
        // treasure card
        img.src = "./resources/treasure.png";
    }
    ctx.drawImage(img, 0, 0, w, h);
    
    // main image
    var elem = document.getElementById("card-image");
    var x = url.searchParams.get('card-x') || 0;
    var y = url.searchParams.get('card-y') || 0;
    var s = url.searchParams.get('card-s') || 75;

    addImage(ctx, elem, w, h, parseInt(x), parseInt(y), parseInt(s)/100.0);
    
    // level
    var val = document.getElementById("card-level").value;
    ctx.textAlign = "center";
    ctx.font = convertFontSize(10) + "pt Quasimodo";
    ctx.fillText(val, 0.5*w, 0.1*h);
    if(val == ""){
        add_space -= 0.04*h;
    }
    
    // type
    var val = document.getElementById("card-type").value;
    ctx.textAlign = "center";
    ctx.font = convertFontSize(9) + "pt CaslonAntique";
    ctx.fillText(val, 0.5*w, 0.14*h+add_space);
    if(val == "" && add_space < 0){
        add_space -= 0.06*h;
    }
    
    // name
    var val = document.getElementById("card-name").value;
    add_space = addQuasimodoText(ctx, val, 12, w, 0.2*h, 1, add_space);
    if(val != ""){
        // prepare filename
        val = val.replace(/[^\x00-\x7F]/g, "x");
        val = val.replace(/[\.\?\!\;\,]/g, "");
        val = val.replaceAll(" ", "_");
        val = val.replace(/-#([A-Z])/g, "-\$1").replace(/-#([a-z])/g, "\$1");
        val = val.replaceAll("#", "_");
        document.getElementById("filename").placeholder = val;
    }
    
    // modify monster
    var val = document.getElementById("card-mod").value;
    add_space = addQuasimodoText(ctx, val, 11, w, 0.3*h, 1, add_space);
    if(val != ""){
        add_space += 2.1*convertFontSize(11)*1.33;
    }
    
    // text 1
    var val = document.getElementById("card-text1").value;
    add_space = addCaslonAntiqueText(ctx, val, 9, w, 0.27*h, 1, add_space);
    
    // text 2
    var val = document.getElementById("card-text2").value;
    add_space = addCaslonAntiqueText(ctx, val, 9, w, 0.89*h, -1, add_space);
    
    // change a level
    var val = document.getElementById("card-change").value;
    add_space = addQuasimodoText(ctx, val, 11, w, 0.9*h, -1, add_space);
    
    // bottom left
    var val = document.getElementById("card-left").value;
    ctx.textAlign = "left";
    ctx.font = convertFontSize(9) + "pt CaslonAntique";
    ctx.fillText(val, 0.125*w, 0.95*h);
    
    // bottom right
    var val = document.getElementById("card-right").value;
    ctx.textAlign = "right";
    ctx.font = convertFontSize(9) + "pt CaslonAntique";
    ctx.fillText(val, 0.875*w, 0.95*h);
    
}

function downloadImage(){
    // get canvas
    var canvas = document.getElementById("canvas");
    
    // create image file for download
    var element = document.createElement('a');
    element.setAttribute("download", getPagename() + ".png");
    element.setAttribute("href", canvas.toDataURL("image/png").replaceAll("image/png", "image/octet-stream"));
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // save the page as well
    // savePage();

    // save settings
    saveJson();
}

window.addEventListener('DOMContentLoaded', (event) => {
    loadPage();
    drawImage();
});

document.querySelector('#download').addEventListener('click', downloadImage);
document.querySelector('#card-background').addEventListener('click', () => {
    updateIcon();
    drawImage();
});
document.querySelector('#card-level').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-level', document.querySelector('#card-level').value);
    window.history.pushState({}, '', url);
    
    drawImage();
});
document.querySelector('#card-type').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-type', document.querySelector('#card-type').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-name').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-name', document.querySelector('#card-name').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-mod').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-mod', document.querySelector('#card-mod').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-text1').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-text1', document.querySelector('#card-text1').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-text2').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-text2', document.querySelector('#card-text2').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-change').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-change', document.querySelector('#card-change').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-left').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-left', document.querySelector('#card-left').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-right').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-right', document.querySelector('#card-right').value);
    window.history.pushState({}, '', url);

    drawImage()
});

document.querySelector('#card-x').addEventListener('change', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-x', document.querySelector('#card-x').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-y').addEventListener('change', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-y', document.querySelector('#card-y').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-s').addEventListener('change', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-s', document.querySelector('#card-s').value);
    window.history.pushState({}, '', url);

    drawImage()
});

document.querySelector('#card-image').addEventListener('change', loadImage);

document.querySelector('#loadJson').addEventListener('change', loadJson);
