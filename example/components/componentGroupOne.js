wu.registerComponent("listbox", (item) => {
  return `
            <div class="panel-body">
                <div class="tile">
                  <div class="tile-icon">
                    <figure class="avatar" data-initial="${item.initial}"></figure>
                  </div>
                  <div class="tile-content">
                    <p class="tile-title text-bold">${item.index} ${item.lastname}</p>
                    <p class="tile-subtitle">${item.fullname}</p>
                  </div>
                </div>
            </div>
            <div class="divider text-center mb-12" data-content="X"></div>
        `;
});

wu.registerComponent("rocketbox", (item) => {
  return `
        <li class="menu-item"><a class="active">${item}</a>
        </li>`;
});
