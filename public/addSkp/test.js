mw.kalturaPluginWrapper(function() {
    //alert("test js loaded");
    mw.PluginManager.add(
        "test",
        mw.KBaseComponent.extend({
            defaultConfig: {
                parent: "videoHolder",
                order: 6,
                buttonLabel: "",
                entryId: "1_isky9qq3",
                cssClass: "my-screen"
            },

            setup: function() {
                var _this = this;

                loadCuePoints = function(callback) {
                    // do the api request
                    _this.getKClient().doRequest(
                        {
                            service: "annotation_annotation",
                            action: "list",
                            "filter:entryIdEqual": _this.embedPlayer.evaluate(
                                "{mediaProxy.entry.id}"
                            ),
                            "filter:objectType": "KalturaCuePointFilter",
                            "filter:cuePointTypeEqual": "annotation.Annotation"
                        },
                        function(data) {
                            // if an error pop out:
                            if (!_this.handleDataError(data)) {
                                return;
                            }
                            callback(data.objects);
                        }
                    );
                };

                this.bind("monitorEvent", function() {
                    var currentTime =
                        _this.embedPlayer.evaluate(
                            "{video.player.currentTime}"
                        ) * 1000;
                    var annotation;
                    if (!_this.annotations) {
                        return;
                    }
                    for (var i = 0; i < _this.annotations.length; i++) {
                        annotation = _this.annotations[i];
                        if (
                            currentTime > annotation.startTime * 1000 &&
                            currentTime < annotation.endTime * 1000
                        ) {
                            //create only once
                            let skipperItem = _this.annotations[i];
                            if (!_this[skipperItem.id]) {
                                _this[skipperItem.id] = true;
                                let cd = JSON.parse(skipperItem.partnerData);
                                let txt = cd.text ? cd.text : "Skip";
                                let that = _this;
                                $(_this.embedPlayer)
                                    .parent()
                                    .parent()
                                    .find(".col")
                                    .append(
                                        $(
                                            `<div id="` +
                                                skipperItem.id +
                                                `" data-skip="`+skipperItem.endTime+`" class="skipper"><span class="skipper-span">` +
                                                txt +
                                                `</span></div>`
                                        ).click(function() {
                                            let seekTo = $(this).attr("data-skip");
                                            that.embedPlayer.sendNotification("doSeek" ,seekTo );
                                        })
                                    );
                            }
                        } else {
                            try {
                                _this.embedPlayer
                                    .getInterface()
                                    .find("#" + annotation.id)
                                    .remove();
                                console.log(
                                    ">>>>> removing",
                                    _this.annotations[i]
                                );
                                _this[_this.annotations[i].id] = null;
                            } catch (e) {}
                        }
                    }
                });

                loadCuePoints(function(d) {
                    _this.annotations = [];
                    for (var i = 0; i < d.length; i++) {
                        _this.annotations.push(d[i]);
                    }
                });
            },
            handleDataError: function(data) {
                // check for errors;
                if (!data || data.code) {
                    return false;
                }
                return true;
            },
            getKClient: function() {
                if (!this.kClient) {
                    this.kClient = mw.kApiGetPartnerClient(
                        this.embedPlayer.kwidgetid
                    );
                }
                return this.kClient;
            },

            getComponent: function() {
                var _this = this;
                if (!this.$el) {
                    this.$el = $(
                        `<div class="container" >
                           <div class="col">
                            </div>
                        </div>
`
                    );
                }
                return this.$el;
            }
        })
    );
});
