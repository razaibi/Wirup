
wu.registerComponent('pricebox', (item) => {return `
<div class="card mt-18">
    <div class="card-header">
      <ul class="step">
        <li class="step-item">
            <a class="tooltip" data-tooltip="Dallas Fort Worth">DFW</a>
        </li>
        <li class="step-item active">
            <a class="tooltip" data-tooltip="John F Kennedy">JFK</a>
        </li>
      </ul>
      <div class="text-center card-subtitle text-gray">No Stops</div>
    </div>
    <div class="card-body">
        <div class="divider text-center" data-content="Fare Details"></div>
        <div class="text-center mt-6">
            <span class="badge" data-badge="2">
                Adults
            </span>
        </div>
        <div class="text-center mt-6">
            <span class="badge" data-badge="1">
                Child
            </span>
        </div>
        
        <div class="columns mt-6">
            <div class="column col-6 col-gapless text-center">
                <div class="text-center card-subtitle text-gray">Departure</div>
                <h3 class="text-bold text-primary">23:40 PM</h3>
            </div>
            <div class="column col-6 col-gapless text-center">
                <div class="text-center card-subtitle text-gray">Arrival</div>
                <h3 class="text-bold text-primary">02:30 AM</h3>
            </div>
        </div>
        <div class="columns mt-6">
            <div class="column col-12 col-gapless text-center">
            <span class="label label-secondary">Adult Fare: ${item.adultFare} USD</span>
            </div>
        </div>
        <div class="columns mt-6">
            <div class="column col-12 col-gapless text-center">
            <span class="label label-secondary">Child Fare: ${item.childFare} USD</span>
            </div>
        </div>
    </div>
    
    <div class="card-footer">
        <div class="columns mt-6">
            <div class="column col-6 col-gapless text-center">
                <div class="text-center card-subtitle text-gray">Tax</div>
                <h5 class="text-bold text-default">${(item.adultFare + item.childFare)*0.08} USD</h5>
            </div>
            <div class="column col-6 col-gapless text-center">
                <div class="text-center card-subtitle text-gray">Total</div>
                <h5 class="text-bold text-primary">${item.adultFare + item.childFare + ((item.adultFare + item.childFare)*0.08)} USD</h5>
            </div>
        </div>        
        <button class="mt-8 btn btn-xlg btn-primary btn-block">Buy Now</button>
    </div>
</div>`            
});
    