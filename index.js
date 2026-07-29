// Vertex 額外模型注入器
// 補上 SillyTavern 內建下拉還沒有、但 Vertex 已經上線的模型。
// 每次載入都會把選項補回去；選過一次後設定存進 data，重整也持久。
//
// 要加別的模型，或正式 model ID 不一樣，改下面這個陣列即可。
const EXTRA_VERTEX_MODELS = [
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    // 'gemini-3.5-flash-preview',
];

const LS_KEY = 'vertexExtraModelChoice';

function injectOptions() {
    const sel = document.getElementById('model_vertexai_select');
    if (!sel) return null;
    let group = sel.querySelector('optgroup[data-extra="1"]');
    if (!group) {
        group = document.createElement('optgroup');
        group.label = '自訂（額外）';
        group.dataset.extra = '1';
        sel.insertBefore(group, sel.firstChild);
    }
    for (const value of EXTRA_VERTEX_MODELS) {
        if (!sel.querySelector(`option[value="${value}"]`)) {
            const opt = document.createElement('option');
            opt.value = value;
            opt.textContent = value;
            group.appendChild(opt);
        }
    }
    return sel;
}

(function init() {
    const wait = setInterval(() => {
        const sel = injectOptions();
        if (!sel) return;
        clearInterval(wait);

        // 記住使用者選的額外模型
        sel.addEventListener('change', () => {
            if (EXTRA_VERTEX_MODELS.includes(sel.value)) {
                localStorage.setItem(LS_KEY, sel.value);
            }
        });

        // 載入後若上次選的是額外模型，重新套用，蓋過 ST 載入時把值重設回內建清單的行為
        const saved = localStorage.getItem(LS_KEY);
        if (saved && EXTRA_VERTEX_MODELS.includes(saved)) {
            let tries = 0;
            const reapply = setInterval(() => {
                injectOptions();
                if (sel.offsetParent !== null && sel.value !== saved) {
                    sel.value = saved;
                    sel.dispatchEvent(new Event('change', { bubbles: true }));
                }
                if (++tries > 15) clearInterval(reapply);
            }, 400);
        }
    }, 250);
    setTimeout(() => clearInterval(wait), 20000);
})();
