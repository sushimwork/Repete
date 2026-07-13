export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%}
body{font-family:'DM Sans',sans-serif;background:#0b0b0b;color:#1a1a1a;font-size:14px;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px}
input,button,select,textarea{font-family:inherit}

/* LOADING */
.loading-screen{height:100vh;display:flex;align-items:center;justify-content:center;background:#0b0b0b;flex-direction:column;gap:14px}
.loading-logo{font-family:'Cormorant Garamond',serif;font-size:38px;color:#b8975a;letter-spacing:.04em;animation:pulse 2s ease-in-out infinite}
.loading-sub{font-size:11px;color:#333;letter-spacing:.12em;text-transform:uppercase}
@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}

/* ── AUTH ── */
.auth-shell{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;background:#0b0b0b}
@media(max-width:700px){.auth-shell{grid-template-columns:1fr}.auth-panel{display:none!important}}
.auth-panel{position:relative;overflow:hidden;background:#0e0e0e;display:flex;flex-direction:column;justify-content:flex-end;padding:48px}
.auth-panel-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 60%,#b8975a0d 0%,transparent 70%)}
.auth-panel-grid{position:absolute;inset:0;background-image:linear-gradient(#b8975a07 1px,transparent 1px),linear-gradient(90deg,#b8975a07 1px,transparent 1px);background-size:48px 48px}
.auth-wardrobe{position:absolute;top:50%;left:50%;transform:translate(-50%,-52%);display:grid;grid-template-columns:repeat(3,80px);gap:12px;opacity:.65}
.auth-outfit{background:#161616;border:1px solid #222;border-radius:10px;aspect-ratio:3/4;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:8px;font-size:34px;transition:transform .4s}
.auth-outfit:nth-child(2){transform:translateY(-12px)}.auth-outfit:nth-child(4){transform:translateY(8px)}
.auth-outfit-lbl{font-size:9px;color:#444;margin-top:5px;text-align:center}
.auth-panel-copy{position:relative;z-index:1}
.auth-logo-big{font-family:'Cormorant Garamond',serif;font-size:28px;color:#b8975a;letter-spacing:.04em;margin-bottom:5px}
.auth-tagline{font-size:12px;color:#444;line-height:1.7;max-width:280px}
.auth-stats{display:flex;gap:28px;margin-top:24px}
.auth-stat-v{font-family:'Cormorant Garamond',serif;font-size:26px;color:#b8975a}
.auth-stat-l{font-size:10px;color:#3a3a3a;text-transform:uppercase;letter-spacing:.09em;margin-top:1px}
.auth-form-panel{display:flex;align-items:center;justify-content:center;padding:40px 32px;background:#f7f5f1;min-height:100vh;overflow-y:auto}
.auth-box{width:100%;max-width:400px}
.auth-heading{font-family:'Cormorant Garamond',serif;font-size:32px;color:#0e0e0e;font-weight:400;margin-bottom:3px}
.auth-sub{font-size:13px;color:#999;margin-bottom:28px}.auth-sub a{color:#b8975a;cursor:pointer;font-weight:500}
.auth-sub a:hover{text-decoration:underline}
.field{margin-bottom:15px}
.field-label{font-size:10px;font-weight:500;color:#777;display:block;margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em}
.field-input{width:100%;padding:11px 15px;border:1.5px solid #e8e5e0;border-radius:8px;font-size:13px;color:#0e0e0e;background:#fff;outline:none;transition:border-color .15s,box-shadow .15s}
.field-input:focus{border-color:#b8975a;box-shadow:0 0 0 3px #b8975a12}
.field-input::placeholder{color:#ccc}
.field-input.err{border-color:#e05252}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:11px}
.pw-wrap{position:relative}.pw-wrap .field-input{padding-right:42px}
.pw-toggle{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#bbb;display:flex;padding:0}
.pw-toggle:hover{color:#666}
.auth-btn{width:100%;padding:13px;border-radius:8px;border:none;background:#0e0e0e;color:#b8975a;font-size:14px;font-weight:500;cursor:pointer;transition:all .18s;letter-spacing:.02em;margin-top:4px}
.auth-btn:hover{background:#1c1c1c}.auth-btn:disabled{opacity:.6;cursor:not-allowed}
.auth-err-box{background:#fff2f2;border:1px solid #f5c6c3;border-radius:7px;padding:11px 14px;font-size:12px;color:#8b2020;margin-bottom:14px;display:flex;gap:8px;align-items:flex-start}
.auth-err-box svg{width:14px;height:14px;flex-shrink:0;margin-top:1px}
.auth-ok-box{background:#f0f9f4;border:1px solid #a8d5ba;border-radius:7px;padding:11px 14px;font-size:12px;color:#1a5c38;margin-bottom:14px;display:flex;gap:8px;align-items:center}
.pw-bar{height:3px;border-radius:2px;margin-top:5px;background:#eee;overflow:hidden}
.pw-fill{height:100%;border-radius:2px;transition:all .3s}
.terms{font-size:11px;color:#bbb;margin-top:14px;text-align:center;line-height:1.6}
.terms a{color:#b8975a;text-decoration:none}

/* ── PLAN SELECTION ── */
.plan-shell{min-height:100vh;background:#f7f5f1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;overflow-y:auto}
.plan-heading{font-family:'Cormorant Garamond',serif;font-size:36px;color:#0e0e0e;text-align:center;font-weight:400;margin-bottom:6px}
.plan-sub{font-size:13px;color:#999;text-align:center;margin-bottom:40px}
.plan-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;width:100%;max-width:880px}
@media(max-width:700px){.plan-grid{grid-template-columns:1fr;max-width:380px}}
.plan-card{background:#fff;border:2px solid #ece9e3;border-radius:14px;padding:28px 26px;cursor:pointer;transition:all .2s;position:relative;display:flex;flex-direction:column}
.plan-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.08)}
.plan-card.popular{border-color:#b8975a}
.plan-card.selected{border-color:#0e0e0e;box-shadow:0 0 0 2px #0e0e0e20}
.plan-badge-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.plan-badge-emoji{font-size:28px}
.popular-pill{font-size:10px;font-weight:600;padding:3px 10px;border-radius:20px;background:#b8975a;color:#fff;letter-spacing:.06em;text-transform:uppercase}
.plan-name{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:#0e0e0e;margin-bottom:3px}
.plan-price{font-size:24px;font-weight:500;color:#0e0e0e;margin-bottom:3px}
.plan-desc{font-size:12px;color:#aaa;margin-bottom:18px;line-height:1.5}
.plan-divider{height:1px;background:#f0ede8;margin-bottom:16px}
.plan-features{display:flex;flex-direction:column;gap:8px;flex:1}
.plan-feat{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:#555;line-height:1.4}
.plan-feat svg{width:13px;height:13px;flex-shrink:0;margin-top:1px}
.plan-miss{color:#ccc}
.plan-select-btn{margin-top:20px;width:100%;padding:11px;border-radius:8px;border:none;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
.plan-highlights{display:flex;gap:16px;margin-top:18px;justify-content:center;flex-wrap:wrap}
.plan-hl{font-size:12px;color:#aaa;display:flex;align-items:center;gap:5px}
.plan-hl svg{width:13px;height:13px;color:#b8975a}

/* ── APP SHELL ── */
.app-shell{display:flex;height:100vh;overflow:hidden;background:#f5f3ef}
.sb{width:214px;background:#0e0e0e;display:flex;flex-direction:column;padding:24px 0;flex-shrink:0}
.sb-logo{font-family:'Cormorant Garamond',serif;font-size:21px;color:#b8975a;padding:0 22px 20px;border-bottom:1px solid #1e1e1e;letter-spacing:.03em}
.sb-logo span{font-size:9px;display:block;color:#3a3a3a;font-family:'DM Sans',sans-serif;margin-top:2px;letter-spacing:.1em;text-transform:uppercase}
.sb-nav{padding:14px 0;flex:1}
.sb-ni{display:flex;align-items:center;gap:9px;padding:10px 22px;color:#4a4a4a;cursor:pointer;font-size:13px;border-left:2px solid transparent;transition:all .15s;user-select:none}
.sb-ni:hover{color:#aaa;background:#131313}.sb-ni.act{color:#b8975a;border-left-color:#b8975a;background:#131313}
.sb-ni svg{width:15px;height:15px;flex-shrink:0}
.sb-plan-chip{margin:0 14px 14px;padding:10px 14px;border-radius:8px;border:1px solid #1e1e1e;background:#131313}
.sb-plan-name{font-size:11px;font-weight:500;color:#b8975a}
.sb-plan-sub{font-size:10px;color:#3a3a3a;margin-top:2px}
.sb-plan-upgrade{font-size:10px;color:#555;cursor:pointer;margin-top:5px;background:none;border:none;padding:0;font-family:'DM Sans',sans-serif;transition:color .15s;text-align:left}
.sb-plan-upgrade:hover{color:#b8975a}
.sb-footer{padding:14px 22px;border-top:1px solid #1e1e1e}
.sb-user{display:flex;align-items:center;gap:9px;margin-bottom:10px}
.sb-av{width:29px;height:29px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;background:#b8975a;color:#0e0e0e}
.sb-uname{font-size:11px;color:#555;line-height:1.4}
.sb-logout{display:flex;align-items:center;gap:5px;font-size:11px;color:#333;cursor:pointer;background:none;border:none;padding:0;font-family:'DM Sans',sans-serif;transition:color .15s}
.sb-logout:hover{color:#e05252}

.app-main{flex:1;overflow-y:auto;background:#f5f3ef}
.pg{display:none;padding:30px 36px;animation:fi .2s ease}
.pg.act{display:block}
@keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}

.ph{margin-bottom:24px;display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px}
.pt{font-family:'Cormorant Garamond',serif;font-size:27px;color:#0e0e0e;font-weight:400;letter-spacing:.01em}
.ps{color:#aaa;font-size:12px;margin-top:2px}

.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;margin-bottom:22px}
.stat-card{background:#0e0e0e;border-radius:10px;padding:17px 19px}
.stat-val{font-family:'Cormorant Garamond',serif;font-size:28px;color:#b8975a;line-height:1}
.stat-lbl{font-size:10px;color:#3a3a3a;margin-top:4px;text-transform:uppercase;letter-spacing:.07em}

.card{background:#fff;border-radius:10px;border:1px solid #ece9e3;overflow:hidden;margin-bottom:16px}
.card-h{padding:15px 20px;border-bottom:1px solid #f5f2ec;display:flex;align-items:center;justify-content:space-between}
.card-t{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:500;letter-spacing:.01em}
.card-b{padding:18px 20px}

.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;border:none}
.btn-dark{background:#0e0e0e;color:#b8975a}.btn-dark:hover{background:#1c1c1c}
.btn-ghost{background:transparent;color:#666;border:1px solid #e0ddd8}.btn-ghost:hover{background:#f5f3ef}
.btn-gold{background:#b8975a;color:#0e0e0e;justify-content:center}.btn-gold:hover{background:#c9a86a}
.btn-sm{padding:5px 11px;font-size:11px}
.btn-del{background:#fdf0ef;color:#c0392b;border:1px solid #f5c6c3}
.btn-upgrade{background:linear-gradient(135deg,#b8975a,#d4b07a);color:#fff;border:none;justify-content:center}

.alert{border-radius:7px;padding:10px 13px;display:flex;gap:9px;align-items:flex-start;margin-bottom:10px;font-size:12px;line-height:1.5}
.alert svg{width:14px;height:14px;flex-shrink:0;margin-top:1px}
.a-warn{background:#fff8f0;border:1px solid #f0c070;color:#7a4a00}
.a-ok{background:#f0f7f3;border:1px solid #a8d5ba;color:#1a5c38}
.a-err{background:#fdf0ef;border:1px solid #f5c6c3;color:#8b2020}
.a-info{background:#f0f4ff;border:1px solid #b8c8f5;color:#2a3f8f}
.a-lock{background:#f9f5ff;border:1px solid #d4bef5;color:#5b21b6;cursor:pointer}
.a-lock:hover{background:#f3eeff}

.meet-list{display:flex;flex-direction:column;gap:7px}
.meet-item{display:flex;align-items:center;gap:10px;padding:10px 13px;background:#f9f8f5;border-radius:7px;border:1px solid #ede9e2}
.meet-time{font-size:10px;color:#bbb;min-width:36px;font-weight:500}
.rb{font-size:10px;font-weight:500;padding:2px 8px;border-radius:20px;white-space:nowrap}
.rb-w{background:#fff0d0;color:#8b5e00}.rb-ok{background:#e8f5ee;color:#1a5c38}.rb-n{background:#f0ede8;color:#aaa}

.limit-bar-wrap{margin-bottom:14px}
.limit-bar-label{display:flex;justify-content:space-between;font-size:11px;color:#aaa;margin-bottom:5px}
.limit-bar{height:4px;background:#f0ede8;border-radius:2px;overflow:hidden}
.limit-bar-fill{height:100%;border-radius:2px;transition:width .3s}

.og{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ot{border-radius:7px;border:2px solid transparent;cursor:pointer;transition:all .15s;background:#f5f3ef;aspect-ratio:3/4;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:8px 6px;position:relative}
.ot:hover{border-color:#d4b07a}.ot.sel{border-color:#b8975a}
.ot-icon{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:34px}
.ot-lbl{font-size:10px;font-weight:500;color:#555;position:relative;z-index:1;text-align:center;background:rgba(255,255,255,.88);border-radius:3px;padding:2px 5px}

.wg{display:grid;grid-template-columns:repeat(auto-fill,minmax(146px,1fr));gap:12px}
.wi{background:#fff;border:1px solid #ece9e3;border-radius:10px;overflow:hidden;transition:all .15s}
.wi:hover{border-color:#c9a86a;transform:translateY(-1px)}
.w-img{height:144px;display:flex;align-items:center;justify-content:center;font-size:44px}
.w-info{padding:9px 12px}
.w-name{font-size:13px;font-weight:500;margin-bottom:2px}
.w-meta{font-size:11px;color:#aaa}.w-uses{font-size:11px;color:#b8975a;margin-top:3px;font-weight:500}
.add-tile{border:2px dashed #ddd;border-radius:10px;height:208px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;color:#ccc;gap:6px;font-size:12px}
.add-tile:hover{border-color:#b8975a;color:#b8975a}
.locked-tile{border:2px dashed #e8d5f5;border-radius:10px;height:208px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#c4a0e8;gap:6px;font-size:12px;background:#faf7ff;cursor:pointer}
.locked-tile svg{width:18px !important;height:18px !important}

.tbl{width:100%;border-collapse:collapse}
.tbl th{text-align:left;font-size:10px;font-weight:500;color:#aaa;text-transform:uppercase;letter-spacing:.07em;padding:0 0 10px;border-bottom:1px solid #f0ede8}
.tbl td{padding:11px 0;border-bottom:1px solid #f9f8f5;font-size:12px;vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.c-row{display:flex;align-items:center;gap:8px}
.c-av{width:29px;height:29px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0}
.o-chip{display:inline-flex;align-items:center;gap:4px;background:#f5f3ef;border-radius:20px;padding:3px 9px;font-size:11px;font-weight:500}

.timeline{display:flex;flex-direction:column}
.tl-item{display:flex;gap:13px;padding:13px 0;border-bottom:1px solid #f9f8f5}
.tl-item:last-child{border-bottom:none}
.tl-date{min-width:74px;font-size:11px;color:#bbb;padding-top:2px}
.tl-icon{width:38px;height:38px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0}
.tl-body{flex:1}.tl-name{font-size:13px;font-weight:500;margin-bottom:4px}
.tl-pills{display:flex;flex-wrap:wrap;gap:5px}
.c-pill{background:#0e0e0e;color:#777;font-size:10px;padding:2px 9px;border-radius:20px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:16px}

.retention-note{display:flex;align-items:center;gap:8px;padding:10px 14px;background:#f9f8f5;border-radius:7px;border:1px solid #ede9e2;font-size:11px;color:#aaa;margin-bottom:14px}
.retention-note svg{width:13px;height:13px;flex-shrink:0}

/* MODAL */
.modal-bg{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:100;align-items:center;justify-content:center;backdrop-filter:blur(2px)}
.modal-bg.open{display:flex}
.modal{background:#fff;border-radius:12px;width:460px;max-width:96vw;overflow:hidden;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.15)}
.modal-h{padding:17px 22px;border-bottom:1px solid #f5f2ec;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.modal-ht{font-family:'Cormorant Garamond',serif;font-size:18px;letter-spacing:.01em}
.modal-x{background:none;border:none;cursor:pointer;color:#bbb;font-size:19px;line-height:1;transition:color .15s}
.modal-x:hover{color:#555}
.modal-b{padding:20px;overflow-y:auto}
.modal-f{padding:13px 22px;border-top:1px solid #f5f2ec;display:flex;gap:8px;justify-content:flex-end;flex-shrink:0}
.fg{margin-bottom:14px}
.fl{font-size:10px;font-weight:500;color:#777;margin-bottom:5px;display:block;text-transform:uppercase;letter-spacing:.08em}
.fi{width:100%;padding:9px 13px;border:1.5px solid #e8e5e0;border-radius:7px;font-size:13px;color:#0e0e0e;background:#faf9f7;outline:none;transition:border-color .15s}
.fi:focus{border-color:#b8975a}
select.fi{appearance:none;cursor:pointer}
.tag-row{display:flex;flex-wrap:wrap;gap:6px}
.tag-pill{padding:5px 11px;border-radius:20px;border:1px solid #e8e5e0;font-size:11px;cursor:pointer;transition:all .15s;background:#fff;color:#777}
.tag-pill:hover,.tag-pill.act{background:#0e0e0e;color:#b8975a;border-color:#0e0e0e}
textarea.fi{resize:none}

/* UPGRADE MODAL */
.upgrade-modal{background:#fff;border-radius:16px;width:560px;max-width:96vw;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.2)}
.upgrade-header{background:#0e0e0e;padding:24px 28px;text-align:center}
.upgrade-logo{font-family:'Cormorant Garamond',serif;font-size:22px;color:#b8975a;margin-bottom:3px}
.upgrade-title{font-size:13px;color:#444}
.upgrade-plans{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:22px}
@media(max-width:500px){.upgrade-plans{grid-template-columns:1fr}}
.up-plan{border:2px solid #ece9e3;border-radius:10px;padding:16px;cursor:pointer;transition:all .15s;text-align:center}
.up-plan:hover{border-color:#b8975a}.up-plan.current{border-color:#0e0e0e;background:#f9f8f5}
.up-plan-emoji{font-size:24px;margin-bottom:6px}
.up-plan-name{font-size:13px;font-weight:500;color:#0e0e0e;margin-bottom:3px}
.up-plan-price{font-size:12px;color:#aaa}
.up-plan-limits{font-size:10px;color:#999;margin-top:8px;line-height:1.7}
.up-plan-btn{width:100%;padding:9px;border-radius:7px;border:none;font-size:12px;font-weight:500;cursor:pointer;margin-top:12px;font-family:'DM Sans',sans-serif;transition:all .15s}

.toast{position:fixed;bottom:22px;right:22px;background:#0e0e0e;color:#b8975a;padding:10px 17px;border-radius:8px;font-size:12px;font-weight:500;z-index:300;opacity:0;transition:opacity .25s;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,.3)}
.toast.show{opacity:1}
.empty-st{text-align:center;padding:36px;color:#ccc;font-size:13px}
`
