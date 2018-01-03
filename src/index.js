import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import registerServiceWorker from './registerServiceWorker';
// import Editor from "./components/Editor/Editor";

// let entry={"mediaType":1,"conversionQuality":34392,"sourceType":"6","dataUrl":"https://cdnapisec.kaltura.com/p/27017/sp/2701700/playManifest/entryId/1_9vga7lbm/format/url/protocol/https","flavorParamsIds":"0,295201,6,295191,5,7,295181","plays":21,"views":53,"lastPlayedAt":1448517608,"width":640,"height":480,"duration":243,"msDuration":243000,"id":"1_9vga7lbm","name":"4 Minutes Countdown Clock Timer","partnerId":27017,"userId":"__ADMIN__26687","creatorId":"__ADMIN__26687","tags":"timers","categories":"clocks","categoriesIds":"5394441","status":2,"moderationStatus":6,"moderationCount":0,"type":1,"createdAt":1339575147,"updatedAt":1428591831,"rank":0,"totalRank":0,"votes":0,"downloadUrl":"https://cdnapisec.kaltura.com/p/27017/sp/2701700/playManifest/entryId/1_9vga7lbm/format/download/protocol/https/flavorParamIds/0","searchText":"_KAL_NET_ _27017_ _MEDIA_TYPE_1|  4 Minutes Countdown Clock Timer timers ","licenseType":-1,"version":0,"thumbnailUrl":"https://cfvod.kaltura.com/p/27017/sp/2701700/thumbnail/entry_id/1_9vga7lbm/version/100001","accessControlId":26703,"replacementStatus":0,"partnerSortValue":0,"conversionProfileId":34392,"rootEntryId":"1_9vga7lbm","operationAttributes":[],"entitledUsersEdit":"","entitledUsersPublish":"","entitledUsersView":"","capabilities":"","displayInSearch":2,"objectType":"KalturaMediaEntry"}

ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<Editor entry={entry} />, document.getElementById('editor'));
registerServiceWorker();
