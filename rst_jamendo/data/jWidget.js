/*
  Copyright (C) 2010 - Thomas Baquet (aka Lord BlackFox)
  http://bitbucket.org/lord_blackfox/

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
function  jwInterface(parent, baseId) {
  this.parent = parent;
  this.baseId = baseId;

  /*if(!hasUI)
    this.makeUI(baseId);*/

  this.audio = document.getElementById(baseId + "audio");
  this.artist = document.getElementById(baseId + "artist");
  this.album = document.getElementById(baseId + "album");
  this.title = document.getElementById(baseId + "title");
  this.volumeBar = document.getElementById(baseId + "volumebar");
  this.progressBar = document.getElementById(baseId + "progressbar");
  this.progressBarPos = document.getElementById(baseId + "progressbarpos");
  this.cover = document.getElementById(baseId + "cover");

  this.buttonPrev = document.getElementById(baseId + "button-prev");
  this.buttonNext = document.getElementById(baseId + "button-next");
  this.buttonPlay = document.getElementById(baseId + "button-play");
  this.buttonPlaylist = document.getElementById(baseId + "button-playlist");
  this.buttonGet = document.getElementById(baseId + "button-get");
  this.buttonPage = document.getElementById(baseId + "button-page");

  this.panelMain = document.getElementById(baseId + "panel-main");
  this.panelPlaylist = document.getElementById(baseId + "panel-playlist");
  this.panelNotifs = document.getElementById(baseId + "panel-notifs");

  //this. = document.getElementById(baseId + "");

  var self = this;
  this.audio.addEventListener("timeupdate", function (evt) { self.updatePositionEvt() }, true);
  this.audio.addEventListener("play", function (evt) { self.playEvt() }, true);
  this.audio.addEventListener("pause", function (evt) { self.pauseEvt() }, true);
  this.audio.addEventListener("ended", function (evt) { self.endedEvt() }, true);
  this.audio.addEventListener("volumechange", function (evt) { self.volumeEvt() }, true);

  this.buttonPlay.addEventListener("click", function (evt) { self.btnPlayEvt() }, true);
  this.buttonNext.addEventListener("click", function (evt) { self.parent.playNext() }, true);
  this.buttonPrev.addEventListener("click", function (evt) { self.parent.playPrev() }, true);
  this.buttonPlaylist.addEventListener("click", function (evt) {
                                                  if(me.panelPlaylist.style.display == "none")
                                                    self.showPanel(1);
                                                  else
                                                    self.showPanel();
                                                }, true);

  this.progressBar.addEventListener("click", function (evt) { self.progressBarEvt(evt) }, true);
  this.progressBar.parentNode.addEventListener("click", function (evt) { self.progressBarEvt(evt) }, true);

  this.volumeBar.addEventListener("click", function (evt) { self.volumeBarEvt(evt) }, true);
  this.volumeBar.parentNode.addEventListener("click", function (evt) { self.volumeBarEvt(evt) }, true);

  this.buttonGet.parentNode.href = "http://www.jamendo.com/download/" + parent.typeName + "/" + parent.id;
  this.buttonPage.parentNode.href = "http://www.jamendo.com/" + parent.typeName + "/" + parent.id;

  this.audio.volume = 0.8;
}
jwInterface.prototype = {
  play : function (track) {
    this.select(track);
    this.audio.src = track.stream;
    this.audio.load();
    this.audio.play();
  },

  secondToMinutes : function (time) {
    time = Math.floor(time);
    var seconds = time % 60;
    var minutes = (time - seconds) / 60;

    if(seconds < 10)
      seconds = "0" + seconds;

    return minutes + ":" + seconds;
  },

  select: function (track) {
    var album = this.parent.albums[track.album_id];

    this.artist.innerHTML = album.artist_name;
    this.album.innerHTML = album.name;
    this.title.innerHTML = track.name + " <small>(" + this.secondToMinutes(track.duration) + ")</small>";

    if(this.cover.src != album.image)
      this.cover.src = album.image;

    if(this.selected && this.selected.playlistElm)
      this.selected.playlistElm.removeAttribute("selected");

    if(track.playlistElm)
      track.playlistElm.setAttribute("selected", "true");

    this.selected = track;
  },

  showPanel : function (panel) {
    if(panel == 1) {
      this.panelMain.style.display = "none";
      this.panelNotifs.style.display = "none";
      this.panelPlaylist.style.display = "block";
      this.buttonPlaylist.src="playlist-selected.png";
      return;
    }

    this.buttonPlaylist.src="playlist.png";

    if(panel == 2) {
      this.panelNotifs.style.display = "block";
      this.panelMain.style.display = "none";
      this.panelPlaylist.style.display = "none";
    }
    else {
      this.panelMain.style.display = "block";
      this.panelPlaylist.style.display = "none";
      this.panelNotifs.style.display = "none";
    }
  },

  notification : function (text) {
    this.panelNotifs.innerHTML = text;
    this.showPanel(2);
  },

  makePlaylist: function () {
    var me = this;
    var obj;
    for(key in this.parent.tracks) {
      var elm = this.parent.tracks[key];
      obj = document.createElement("div");
      obj.setAttribute("class", "jw-select-track");
      obj.innerHTML = key + " - " + elm.name;
      obj.track = elm;

      obj.addEventListener("click", function (evt) {
        me.parent.play(evt.currentTarget.track);
      }, true);

      elm.playlistElm = obj;
      this.panelPlaylist.appendChild(obj);
    }
  },

  /*********************************************************************
   *    Events
   ********************************************************************/
  progressWidth : 220,
  volumeWidth : 100,

  updatePositionEvt : function() {
    this.progressBar.style.width = this.audio.currentTime * this.progressWidth / this.audio.duration;

    this.progressBarPos.innerHTML = this.secondToMinutes(this.audio.currentTime);
  },

  progressBarEvt : function (evt) {
    this.audio.currentTime = (evt.clientX - this.progressBar.getBoundingClientRect().left) * this.audio.duration / this.progressWidth;
  },

  volumeBarEvt : function (evt) {
    this.audio.volume = (evt.clientX - this.volumeBar.getBoundingClientRect().left) / this.volumeWidth;
    this._volume = this.audio.volume;
  },

  playEvt : function() {
    this.buttonPlay.src = "pause.png";
    if(this._volume)
        this.audio.volume = this._volume;
  },

  pauseEvt : function () {
    this.buttonPlay.src = "play.png";
  },

  endedEvt : function () {
    this.buttonPlay.src = "play.png";
    this.parent.playNext();
  },

  volumeEvt : function () {
    this.volumeBar.style.width = this.audio.volume * this.volumeWidth;
  },

  btnPlayEvt : function () {
    if(!this.audio.paused)
      this.audio.pause();
    else if(this.audio.src)
      this.audio.play();
    else
      this.parent.play();
  },

  tracksLoaded : function () {
    this.panelNotifs.addEventListener("click", function (evt) { me.showPanel() }, true);
    this.showPanel();

    this.makePlaylist();
    this.select(this.parent.tracks[this.parent.actu]);
  },

}

function jwPlayer(id, typeName, baseId, autoplay) {
  this.id = id;
  this.typeName = typeName;
  this.autoplay = autoplay;

  this.ui = new jwInterface(this, baseId); //UI

  this.tracks = new Array();
  this.albums = new Array();

  this.actu = 0;
  this.cplay = 0;

  this.load(typeName, id);
}
jwPlayer.prototype = {
  tracks : 0,
  name : 0,
  typeName : 0,
  infos : 0,
  image : 0,

  clear : function () {
    this.tracks = new Array();
    this.albums = new Array();
  },

  /*********************************************************************
   *    Player
   ********************************************************************/
  play : function (track) {
    if(!track) {
      while(this.actu < 0)
        this.actu += this.tracks.length;
      track = this.tracks[this.actu];
    }
    this.ui.play(track);

    this.cplay++;
  },

  /*playRandom : function () {
  },*/

  next : function () {
    var track;
    this.actu++;
    if(this.actu >= this.tracks.length) {
      this.actu = 0;
      this.ui.select(this.tracks[this.actu]);
      return undefined;
    }
    return this.tracks[this.actu];
  },

  prev : function () {
    this.actu--;
    if(this.actu < 0) {
      this.actu += this.tracks.length;
      this.ui.select(this.tracks[this.actu]);
    }

    return this.tracks[this.actu];
  },

  playNext : function () {
    var track = this.next();
    if(track)
      this.play(track);
  },

  playPrev : function () {
    var track = this.prev();
    if(track)
      this.play(track);
  },

  /*********************************************************************
   *    Jamendo API + Loader
   ********************************************************************/
  makeReq : function(url, success, error) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
        if(req.status == 200)
          success(req.responseText);
        else
          alert("ERROR: " + req.responseText);
      }
    };
    req.send(null);
  },

  load : function() {
    //todo: ui load state
    this.clear();

    var me = this;
    this.makeReq("http://api.jamendo.com/get2/id+name+stream+duration+album_id/track/json/?" + this.typeName + "_id=" + this.id + "&streamencoding=ogg2",
                 function(text) { me.tracksLoaded(text) });
  },

  tracksLoaded : function(text) {
    var obj = JSON.parse(text);
    if(!obj) {
      this.ui.notification("For type " + this.typeName + ", " + this.id + " doesn't exists");
      return -1;
    }

    var albumlist = "";
    var sObj;
    for(var i in obj) {
      sObj = obj[i];
      this.tracks[i] = sObj;
      albumlist += "+" + sObj.album_id;
    }

    var me = this;
    this.makeReq("http://api.jamendo.com/get2/id+name+artist_name+image/album/json/?album_id=" + albumlist,
                 function(text) { me.albumsLoaded(text) });
  },

  albumsLoaded : function(text) {
    var obj = JSON.parse(text);
    if(!obj) {
      this.ui.notification("Error when loading albums informations for type " + this.typeName + " with " + this.id);
      return -1;
    }

    var sObj;
    for(var i in obj) {
      sObj = obj[i];
      this.albums[sObj.id] = sObj;
    }

    this.ui.tracksLoaded();
    if(this.autoplay)
      this.play();
  },
}

var jwLastId = 0;
var player;

//this function will create a new UI
/*function    jwSetup (type, id, autoplay) {
  var baseId = "jw_" + jwLastId + "_";
  new jwPlayer(id, type, baseId, autoplay);
  jwLastId++;
}*/
