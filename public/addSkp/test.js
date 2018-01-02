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

                loadCuePoints = (function(callback) {
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
                })


                this.bind('monitorEvent', function () {
                    var currentTime = _this.embedPlayer.evaluate("{video.player.currentTime}") * 1000;
                    var annotation;
                    if (!_this.annotations) {
                        return;
                    }
                    for (var i = 0; i < _this.annotations.length; i++) {
                        annotation = _this.annotations[i];
                        if (currentTime > annotation.startTime*1000 && currentTime < annotation.endTime*1000) {
                            console.log(annotation.partnerData)

                        } else {
                            try {
                                _this.embedPlayer.getInterface().find("#" + annotation.id).hide();
                            } catch (e) {
                            }
                        }
                    }

                });


                loadCuePoints(function(d){
                    _this.annotations = [];
                    for (var i = 0; i < d.length; i++) {
                        _this.annotations.push(d[i]);
                    }
                })

                this.embedPlayer.addJsListener(
                    "KalturaSupport_CuePointReached",
                    function() {
                        alert(3);
                    }
                );
                this.embedPlayer.addJsListener("cuePointReached", function() {
                    alert(4);
                });

                //this.embedPlayer.evaluate('{mediaProxy.entryCuePoints}');

                this.embedPlayer.bindHelper(
                    "KalturaSupport_CuePointReached",
                    function() {
                        alert(1);
                    }
                );
                this.embedPlayer.bindHelper("cuePointReached", function() {
                    alert(2);
                });

                this.bind("seeked", function() {
                    debugger;
                    $(this)
                        .parent()
                        .parent()
                        .find(".col")
                        .append(
                            $(
                                `<div class="skipper"><span class="skipper-span">pp00</span></div>`
                            )
                        );
                });
            },
            handleDataError: function (data) {
                // check for errors;
                if (!data || data.code) {
                    return false;
                }
                return true;
            },
            getKClient: function () {
                if (!this.kClient) {
                    this.kClient = mw.kApiGetPartnerClient(this.embedPlayer.kwidgetid);
                }
                return this.kClient;
            },

            getComponent: function() {
                var _this = this;
                if (!this.$el) {
                    this.$el = $(
                        `<div class="container" >
                           <div class="col">
                                <div class="skipper"><span class="skipper-span">Skip Intro asdas</span></div>
                                <div class="skipper"><span class="skipper-span">Lecture 1</span></div>
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
