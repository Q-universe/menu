const menuData = [
  // 肉类（猪、鸡、牛）
  { id: "hongshaopaigu", name: "红烧排骨", category: "猪肉", tags: ["红烧"], spicy: false, light: false, desc: "软烂入味的红烧排骨", img: "./images/hongshaopaigu.png" },
  { id: "qinglajiaochaorou", name: "青辣椒炒肉", category: "猪肉", tags: ["下饭"], spicy: true, light: false, desc: "青辣椒炒肉，微辣香口", img: "./images/qinglajiaochaorou.png" },
  { id: "kelejichi", name: "可乐鸡翅", category: "鸡肉", tags: ["鸡肉"], spicy: false, light: false, desc: "可乐入味的鸡翅，甜香多汁", img: "./images/kelejichi.png" },
  { id: "zhaoshaojitui", name: "照烧鸡腿", category: "鸡肉", tags: ["鸡肉"], spicy: false, light: false, desc: "照烧鸡腿，甜咸鲜香", img: "./images/zhaoshaojitui.png" },
  { id: "fanqiefeiniu", name: "番茄肥牛", category: "牛肉", tags: ["牛肉"], spicy: false, light: false, desc: "番茄慢炖肥牛，酸甜鲜香", img: "./images/fanqiefeiniu.png" },

  // 蔬菜
  { id: "culiubaicai", name: "醋溜白菜", category: "蔬菜", tags: ["蔬菜"], spicy: false, light: true, desc: "醋溜白菜，清爽脆口", img: "./images/culiubaicai.png" },
  { id: "culiutudousi", name: "醋溜土豆丝", category: "蔬菜", tags: ["蔬菜"], spicy: false, light: true, desc: "土豆丝脆爽，酸甜开胃", img: "./images/culiutudousi.png" },
  { id: "doufubaicai", name: "豆腐白菜", category: "蔬菜", tags: ["豆制品"], spicy: false, light: true, desc: "豆腐搭配白菜，口感清淡", img: "./images/doufubaicai.png" },
  { id: "ganguocaihua", name: "干锅菜花", category: "蔬菜", tags: ["家常"], spicy: true, light: false, desc: "干锅菜花，香辣入味", img: "./images/ganguocaihua.png" },
  { id: "liangbanbocai", name: "凉拌菠菜", category: "蔬菜", tags: ["凉拌"], spicy: false, light: true, desc: "凉拌菠菜，清爽解腻", img: "./images/liangbanbocai.png" },
  { id: "suanrongxiaobaicai", name: "蒜蓉小白菜", category: "蔬菜", tags: ["蔬菜"], spicy: false, light: true, desc: "蒜蓉小白菜，蒜香清甜", img: "./images/suanrongxiaobaicai.png" },

  // 其他
  { id: "doufubao", name: "豆腐煲", category: "其他", tags: ["豆制品"], spicy: false, light: true, desc: "暖暖的豆腐煲，细嫩入味", img: "./images/doufubao.png" },
  { id: "xiarenfensibaicai", name: "虾仁粉丝白菜", category: "其他", tags: ["海鲜"], spicy: false, light: true, desc: "虾仁粉丝白菜，鲜甜爽滑", img: "./images/xiarenfensibaicai.png" },
  { id: "xilanhuaxiaren", name: "西兰花虾仁", category: "其他", tags: ["海鲜"], spicy: false, light: true, desc: "西兰花虾仁，清爽低脂", img: "./images/xilanhuaxiaren.png" },
];

const state = {
  cart: [],
  filters: {
    category: "全部",
    search: "",
    healthyOnly: false,
    spicyOnly: false,
  },
};

const el = {
  menuList: document.getElementById("menuList"),
  chips: document.getElementById("categoryChips"),
  search: document.getElementById("searchInput"),
  healthy: document.getElementById("healthyToggle"),
  spicy: document.getElementById("spicyToggle"),
  cartPanel: document.getElementById("cartPanel"),
  cartItems: document.getElementById("cartItems"),
  cartEmpty: document.getElementById("cartEmpty"),
  cartNotice: document.getElementById("cartNotice"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  checkoutModal: document.getElementById("checkoutModal"),
  closeModal: document.getElementById("closeModal"),
  orderMessage: document.getElementById("orderMessage"),
  copyMessage: document.getElementById("copyMessage"),
  copyStatus: document.getElementById("copyStatus"),
};

function init() {
  renderChips();
  renderMenu();
  bindEvents();
  el.healthy.classList.toggle("active", state.filters.healthyOnly);
  el.spicy.classList.toggle("active", state.filters.spicyOnly);
}

function renderChips() {
  const categories = ["全部", ...new Set(menuData.map(i => i.category))];
  el.chips.innerHTML = "";
  categories.forEach(cat => {
    const b = document.createElement("button");
    b.className = `chip ${state.filters.category === cat ? "active" : ""}`;
    b.textContent = cat;
    b.onclick = () => {
      state.filters.category = cat;
      renderMenu();
    };
    el.chips.appendChild(b);
  });
}

function renderMenu() {
  const list = menuData.filter(item => {
    if (state.filters.category !== "全部" && item.category !== state.filters.category) return false;
    if (state.filters.healthyOnly && !item.light) return false;
    if (state.filters.spicyOnly && !item.spicy) return false;
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.desc.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  el.menuList.innerHTML = "";
  list.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card__img-wrap">
        <img class="card__img" src="${item.img}" alt="${item.name}">
      </div>
      <div class="card__head">
        <h3>${item.name}</h3>
      </div>
      <p class="card__desc">${item.desc}</p>
      <div class="card__tags">
        ${item.spicy ? "<span>🌶️ 微辣</span>" : "<span>清淡</span>"}
        ${item.tags.map(t => `<span>${t}</span>`).join("")}
      </div>
      <div class="card__foot" style="display:flex;justify-content:flex-end;">
        <button class="btn ghost" data-id="${item.id}">加入</button>
      </div>
    `;
    card.querySelector("button").onclick = () => addToCart(item.id);
    el.menuList.appendChild(card);
  });
}

function addToCart(id) {
  const target = state.cart.find(c => c.id === id);
  if (target) return;
  state.cart.push({ id, qty: 1 });
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(c => c.id !== id);
  renderCart();
}

function renderCart() {
  el.cartItems.innerHTML = "";
  if (!state.cart.length) {
    el.cartEmpty.style.display = "block";
    el.cartNotice.textContent = "";
  } else {
    el.cartEmpty.style.display = "none";
    el.cartNotice.textContent = "";
  }

  state.cart.forEach(c => {
    const m = menuData.find(i => i.id === c.id);
    if (!m) return;

    const row = document.createElement("div");
    row.className = "cart__item";
    row.innerHTML = `
      <div>
        <strong>${m.name}</strong>
      </div>
      <div class="qty">
        <button aria-label="移除" onclick="removeFromCart('${c.id}')">✕</button>
      </div>
    `;
    el.cartItems.appendChild(row);
  });
}

function bindEvents() {
  el.search.addEventListener("input", (e) => {
    state.filters.search = e.target.value.trim();
    renderMenu();
  });

  el.healthy.onclick = () => {
    state.filters.healthyOnly = !state.filters.healthyOnly;
    el.healthy.classList.toggle("active", state.filters.healthyOnly);
    renderMenu();
  };

  el.spicy.onclick = () => {
    state.filters.spicyOnly = !state.filters.spicyOnly;
    el.spicy.classList.toggle("active", state.filters.spicyOnly);
    renderMenu();
  };

  el.checkoutBtn.onclick = async () => {
    if (!state.cart.length) {
      el.cartNotice.textContent = "购物篮还是空的哦。";
      return;
    }
    const message = buildOrderMessage();
    showMessageModal(message);
  };

  el.closeModal.onclick = () => hideMessageModal();

  el.copyMessage.onclick = async () => {
    const message = el.orderMessage.value;
    try {
      await navigator.clipboard.writeText(message);
      state.cart = [];
      renderCart();
      hideMessageModal();
    } catch (err) {
      console.error("Clipboard write failed", err);
      el.copyStatus.textContent = "复制失败，请手动全选复制。";
    }
  };

}

window.removeFromCart = removeFromCart;
window.addEventListener("DOMContentLoaded", init);

function buildOrderMessage() {
  const itemsText = state.cart
    .map(c => {
      const m = menuData.find(i => i.id === c.id);
      if (!m) return null;
      return m.name;
    })
    .filter(Boolean)
    .join("，");
  const body = itemsText || "暂时还没想好，等下再告诉你~";
  return `亲爱的70，我想吃：${body}。❤️`;
}

function showMessageModal(message) {
  el.orderMessage.value = message;
  el.copyStatus.textContent = "";
  el.checkoutModal.classList.add("show");
  navigator.clipboard.writeText(message)
    .then(() => {
      state.cart = [];
      renderCart();
    })
    .catch(() => {
      el.copyStatus.textContent = "自动复制失败，可手动复制或点按钮重试。";
    });
}

function hideMessageModal() {
  el.checkoutModal.classList.remove("show");
}
