wu.registerComponent('listbox', (item) => {
    return `
    <li>
        <p>
            <span class="result_no">${item.index}</span>  <span class="result_title"><span class="result_cap"> ${item.initial}</span>${item.lastname}</span>
        </p>
        <p class="result_desc">${item.fullname}</p>
    </li>
    `            
});


wu.registerComponent('rocketbox', (item) => {return `
    <li>
    <p class="network_title">${item}</p>
    </li>`            
});

wu.registerComponent('pricebox', (item) => {return `

<div class="row">
<div class="flight_destination glide_left">
    DFW
</div>
<div class="flight_interim">
    to
</div>
<div class="flight_destination glide_right">
    JFK
</div>
<div class="flight_class">Class <span class="premium_class">Business</span></div>
<div class="flight_airport glide_left">
    Forth Worth International Airport
</div>
<div class="flight_airport glide_right">
    JFK International Airport
</div>
<div class="row">
    <div class="flight_time glide_left">
        23:40 PM
    </div>
    <div class="flight_stops glide_left">
        0 Stops
    </div>
    <div class="flight_time glide_right">
        02:10 AM
    </div>
</div>
<div class="flight_day glide_left">
    23th October, 2016
</div>
<div class="flight_day glide_right">
    24th October, 2016
</div>
<div class="flight_pax_detail glide_left">
    1 X Adult(s)
</div>
<div class="flight_pax_detail glide_right">
    ${item.adultFare} USD
</div>
<div class="flight_pax_detail glide_left">
    2 X Children
</div>
<div class="flight_pax_detail glide_right">
    ${item.childFare} USD
</div>
<div class="flight_tax_detail glide_left">
    Taxes
</div>
<div class="flight_tax_detail glide_right">
    ${(item.adultFare + item.childFare)*0.08} USD
</div>
<div class="flight_total_detail glide_left">
    Total
</div>
<div class="flight_total_detail glide_right">
    ${item.adultFare + item.childFare + ((item.adultFare + item.childFare)*0.08)} USD
</div>`            
});
