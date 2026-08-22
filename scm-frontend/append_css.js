const fs = require('fs');
const css = `
/* ============ AUTH PAGES ============ */
.auth-page{min-height:calc(100vh - 130px);background:linear-gradient(135deg,#1a0a04 0%,#4a1a08 50%,#1a0a04 100%);display:flex;align-items:center;justify-content:center;padding:40px 20px;}
.auth-box{background:#fff;border-radius:20px;width:100%;max-width:440px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.25);}
.auth-tabs{display:flex;}
.auth-tab{flex:1;padding:18px;text-align:center;font-size:15px;font-weight:600;color:var(--brown);cursor:pointer;background:var(--cream-dark);border:none;transition:all .25s;font-family:'Inter',sans-serif;}
.auth-tab.active{background:#fff;color:var(--red);}
.auth-body{padding:32px;}
.auth-logo{text-align:center;margin-bottom:22px;}
.auth-logo img{height:52px;margin:0 auto 8px;}
.auth-logo p{font-size:13px;color:var(--brown);}
.fg{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;}
.fg label{font-size:13px;font-weight:600;color:var(--charcoal);}
.inp-wrap{position:relative;}
.inp-wrap input{width:100%;padding:13px 42px 13px 14px;border:1.5px solid var(--cream-dark);border-radius:8px;font-size:14px;font-family:'Inter',sans-serif;color:var(--charcoal);outline:none;transition:border .2s;}
.inp-wrap input:focus{border-color:var(--red);}
.inp-icon{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--brown);font-size:14px;cursor:pointer;}
.inp-icon:hover{color:var(--red);}
.forgot{text-align:right;margin-top:-6px;margin-bottom:14px;}
.forgot a{font-size:12px;color:var(--saffron);font-weight:500;}
.auth-btn{width:100%;padding:14px;background:var(--red);color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:16px;transition:all .25s;font-family:'Inter',sans-serif;}
.auth-btn:hover{background:var(--red-dark);}
.or-div{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.or-div::before,.or-div::after{content:'';flex:1;height:1px;background:var(--cream-dark);}
.or-div span{font-size:12px;color:var(--brown);}
.google-btn{width:100%;padding:13px;background:#fff;border:1.5px solid var(--cream-dark);border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .25s;color:var(--charcoal);font-family:'Inter',sans-serif;}
.google-btn:hover{border-color:var(--red);background:rgba(181,57,10,.03);}
.google-btn img{width:18px;height:18px;}
.auth-switch{text-align:center;margin-top:16px;font-size:13px;color:var(--brown);}
.auth-switch a{color:var(--red);font-weight:600;}
.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

/* ============ CUSTOMER ACCOUNT LAYOUT (My Profile / My Orders) ============ */
.acct-wrap{max-width:1180px;margin:0 auto;padding:44px 32px 90px;display:grid;grid-template-columns:240px 1fr;gap:32px;align-items:start;}
.acct-side{background:#fff;border:1px solid var(--cream-dark);border-radius:14px;padding:22px;position:sticky;top:90px;}
.acct-user{display:flex;align-items:center;gap:12px;padding-bottom:16px;border-bottom:1px solid var(--cream-dark);margin-bottom:14px;}
.acct-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--red),var(--saffron));color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--font-d);font-weight:700;font-size:16px;flex-shrink:0;}
.acct-user-name{font-size:14px;font-weight:600;color:var(--charcoal);}
.acct-user-email{font-size:11.5px;color:var(--brown);word-break:break-all;}
.acct-nav a{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:8px;font-size:13.5px;font-weight:500;color:var(--charcoal);margin-bottom:3px;transition:all .2s;}
.acct-nav a i{width:16px;color:var(--brown);}
.acct-nav a:hover,.acct-nav a.active{background:var(--cream-dark);color:var(--red);}
.acct-nav a.active i{color:var(--red);}
.acct-nav button.logout-btn{width:100%;text-align:left;background:none;border:none;display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:8px;font-size:13.5px;font-weight:500;color:var(--red);cursor:pointer;font-family:'Inter',sans-serif;margin-top:8px;}
.acct-nav button.logout-btn:hover{background:rgba(181,57,10,.08);}
.acct-main h1{font-family:var(--font-d);font-size:24px;color:var(--charcoal);margin-bottom:4px;}
.acct-main > p.sub-lbl{font-size:13px;color:var(--brown);margin-bottom:26px;}
@media(max-width:800px){.acct-wrap{grid-template-columns:1fr;}.acct-side{position:static;}}

/* profile cards */
.pf-card{background:#fff;border:1px solid var(--cream-dark);border-radius:14px;padding:26px 28px;margin-bottom:22px;}
.pf-card-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}
.pf-card-hdr h2{font-family:var(--font-d);font-size:17px;color:var(--charcoal);}
.pf-edit-btn{background:none;border:1.5px solid var(--cream-dark);color:var(--red);font-size:12.5px;font-weight:600;padding:6px 14px;border-radius:20px;cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif;}
.pf-edit-btn:hover{background:var(--red);color:#fff;border-color:var(--red);}
.pf-row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:14px;}
.pf-field label{display:block;font-size:11px;color:var(--brown);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;}
.pf-field .pf-val{font-size:14px;color:var(--charcoal);font-weight:500;}
.pf-field input{width:100%;padding:10px 12px;border:1.5px solid var(--cream-dark);border-radius:8px;font-size:14px;font-family:'Inter',sans-serif;color:var(--charcoal);outline:none;}
.pf-field input:focus{border-color:var(--red);}
.pf-badge-note{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--saffron);background:rgba(232,130,26,.1);padding:4px 10px;border-radius:12px;margin-top:6px;}

/* addresses */
.addr-card{border:1.5px solid var(--cream-dark);border-radius:12px;padding:18px 20px;margin-bottom:14px;position:relative;}
.addr-card.is-default{border-color:var(--saffron);background:rgba(232,130,26,.03);}
.addr-label-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.addr-label{font-size:12.5px;font-weight:700;color:var(--charcoal);text-transform:uppercase;letter-spacing:.4px;}
.addr-default-chip{font-size:10px;background:var(--saffron);color:#fff;padding:2px 8px;border-radius:10px;font-weight:700;}
.addr-text{font-size:13px;color:var(--brown);line-height:1.6;}
.addr-actions{display:flex;gap:10px;margin-top:10px;}
.addr-actions button{background:none;border:none;font-size:12px;font-weight:600;color:var(--red-dark);cursor:pointer;font-family:'Inter',sans-serif;padding:0;}
.addr-actions button.del{color:var(--brown);}
.addr-empty{text-align:center;padding:30px;color:var(--brown);font-size:13px;}

/* toast */
.scm-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--charcoal);color:#fff;padding:13px 24px;border-radius:10px;font-size:13.5px;font-weight:500;box-shadow:0 10px 30px rgba(0,0,0,.25);display:flex;align-items:center;gap:10px;opacity:0;pointer-events:none;transition:all .3s;z-index:9999;}
.scm-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.scm-toast i{color:var(--saffron);}

/* loading / empty / error states */
.acct-loading,.acct-empty,.acct-error{text-align:center;padding:70px 20px;color:var(--brown);}
.acct-loading i{font-size:26px;color:var(--saffron);margin-bottom:12px;animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.acct-empty i,.acct-error i{font-size:44px;color:var(--cream-mid);margin-bottom:14px;}
.acct-empty h3,.acct-error h3{font-family:var(--font-d);font-size:18px;color:var(--charcoal);margin-bottom:6px;}

/* order list specific */
.order-card{cursor:pointer;transition:box-shadow .2s,transform .2s;}
.order-card:hover{box-shadow:0 10px 26px rgba(30,26,24,.09);transform:translateY(-2px);}
.status-cancelled{background:rgba(181,57,10,.1);color:var(--red-dark);}
.status-confirmed{background:rgba(14,130,232,.1);color:#0e82e8;}
.status-packed{background:rgba(201,146,13,.12);color:var(--gold);}
.order-total-row{display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:14px;border-top:1px solid var(--cream-dark);}
.order-total-row .ot-amt{font-family:var(--font-d);font-weight:700;font-size:17px;color:var(--red);}
.order-view-link{font-size:12.5px;font-weight:600;color:var(--red-dark);}

/* order detail specifics */
.od-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
.od-summary-box{border:1px solid var(--cream-dark);border-radius:12px;padding:20px;}
.od-summary-box h4{font-family:var(--font-d);font-size:14.5px;color:var(--charcoal);margin-bottom:12px;}
.od-row{display:flex;justify-content:space-between;font-size:13px;color:var(--brown);padding:5px 0;}
.od-row.total{border-top:1px solid var(--cream-dark);margin-top:8px;padding-top:10px;font-weight:700;color:var(--charcoal);font-size:14.5px;}
@media(max-width:700px){.od-grid{grid-template-columns:1fr;}}

/* ============ MAP LOCATION PICKER (Leaflet + OpenStreetMap) ============ */
.map-picker{margin-bottom:22px;}
.map-picker-label{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--charcoal);margin-bottom:10px;}
.map-picker-label i{color:var(--red);}
.map-search-wrap{position:relative;margin-bottom:10px;}
.map-search-input{width:100%;padding:12px 14px 12px 40px;border-radius:10px;border:1.5px solid var(--cream-dark);font-size:14px;font-family:'Inter',sans-serif;outline:none;}
.map-search-input:focus{border-color:var(--red);}
.map-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--brown);font-size:13px;}
.map-search-results{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1px solid var(--cream-dark);border-radius:10px;box-shadow:0 10px 28px rgba(30,26,24,.12);max-height:220px;overflow-y:auto;z-index:1000;display:none;}
.map-search-results.show{display:block;}
.map-search-result-item{padding:11px 14px;font-size:13px;color:var(--charcoal);cursor:pointer;border-bottom:1px solid var(--cream-dark);display:flex;gap:10px;align-items:flex-start;}
.map-search-result-item:last-child{border-bottom:none;}
.map-search-result-item:hover{background:var(--cream-dark);}
.map-search-result-item i{color:var(--saffron);margin-top:2px;flex-shrink:0;}
.map-picker-canvas{width:100%;height:260px;border-radius:12px;overflow:hidden;border:1.5px solid var(--cream-dark);}
.map-picker-hint{display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--brown);margin-top:8px;}
.map-picker-hint i{color:var(--saffron);}
.map-picker-coords{font-size:11px;color:var(--brown);margin-top:4px;font-family:monospace;}
.map-picker-loading{font-size:12px;color:var(--brown);padding:8px 14px;}
/* Leaflet override: keep default marker/tiles, just round the container corners cleanly */
.leaflet-container{font-family:'Inter',sans-serif;}

/* ============ ADDRESS MODAL ============ */
.addr-modal-overlay{position:fixed;inset:0;background:rgba(20,14,10,.6);display:flex;align-items:center;justify-content:center;z-index:2000;padding:20px;visibility:hidden;opacity:0;transition:all .3s;}
.addr-modal-overlay.show{visibility:visible;opacity:1;}
.addr-modal{background:#fff;border-radius:16px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;padding:28px;}
.addr-modal-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}
.addr-modal-hdr h3{font-family:var(--font-d);font-size:19px;color:var(--charcoal);}
.addr-modal-close{background:none;border:none;font-size:18px;color:var(--brown);cursor:pointer;}
.addr-modal .fg{margin-bottom:14px;}
.addr-modal .fg label{display:block;font-size:12px;color:var(--brown);margin-bottom:5px;font-weight:600;}
.addr-modal .fg input,.addr-modal .fg select{width:100%;padding:10px 12px;border:1.5px solid var(--cream-dark);border-radius:8px;font-size:14px;font-family:'Inter',sans-serif;outline:none;}
.addr-modal .fg input:focus,.addr-modal .fg select:focus{border-color:var(--red);}
.addr-modal .form-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.addr-modal-actions{display:flex;gap:10px;margin-top:20px;}
.addr-modal-actions button{flex:1;justify-content:center;}

@media(max-width:600px){
  .map-picker-canvas{height:200px;}
  .map-search-result-item{font-size:12px;}
}
`;
fs.appendFileSync('D:/sunil-choudhary-masala/app/globals.css', '\n' + css);
console.log('Appended CSS to globals.css');
