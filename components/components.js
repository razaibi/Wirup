
wuObject.registerComponent({
    "componentName": "computerBox",
    "HTML": `
            <ul class="panel" data-list="computers">
            <li class="row">
                <p class="notif_title">--state--</p>
                <p class="notif_desc">--city--</p>
                
            </li>
                            
    </ul>`
});

wuObject.registerComponent({
    "componentName": "priceBox",
    "HTML": `<div class="panel" data-list="cars">
            <div class="row">
                    <h2 contenteditable="true" class="dark_title">--name--</h2>
                    <p>--price--</p>
            </div>

</div>`
});


wuObject.registerComponent({
    "componentName": "newsBox",
    "HTML": `<div class="panel" data-list="news">
            <div class="row">
                    <h2 class="light_title">--headline--</h2>
                    <p>--content--</p>
                    
            </div>

</div>`
});