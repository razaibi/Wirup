wuObject.registerComponent('samplebox', (item) => {
        return `
          <h2>
          Hey User: ${item.name}
          </h2>`            
});


wuObject.registerComponent('linkbox', (item) => {return `
                    <p>
                        Link name: ${item.name}
                    </p>`            
});
