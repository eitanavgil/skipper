import React, { Component } from "react";
import { Button } from "reactstrap";
import { PlusIcon, ArrowDownIcon } from "react-octicons";
import Skipper from "../Skipper/Skipper";
import EditorForm from "./EditorForm/EditorForm";

/**
 *
 */
class Editor extends Component {
    // props
    props: {};

    // default values for props
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            currentSkipper: {},
            skippers: null
        };
        this.preview = this.preview.bind(this);
        this.onEditCp = this.onEditCp.bind(this);
        this.onDeleteCp = this.onDeleteCp.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getCurrentTime = this.getCurrentTime.bind(this);
        this.listCuePoints = this.listCuePoints.bind(this);
        this.listCuePoints();
    }
    preview() {
        let URL =
            "https://www.kaltura.com/index.php/extwidget/preview/partner_id/27017/uiconf_id/29667911/entry_id/" +
            this.props.entry.id +
            "/embed/dynamic?flashvars[ks]=" +
            window.ks;

            window.open(URL,"_blank")

    }
    onDeleteCp() {
        this.listCuePoints();
    }
    onEditCp(cp) {
        console.log(">>>>> REC", cp);
        this.setState({
            skippers: this.state.skippers,
            currentSkipper: cp
        });
    }

    listCuePoints() {
        if (!window.kClient) {
            this.hasClient = setInterval(() => {
                clearInterval(this.hasClient);
                this.listCuePoints();
            }, 30);
            return;
        }
        clearInterval(this.hasClient);

        this.listCuePointsInterval = setInterval(() => {
            if (window.CurrentLoadedCp) {
                this.setState({
                    skippers: window.CurrentLoadedCp,
                    currentSkipper: null
                });
                clearInterval(this.listCuePointsInterval);
            }
        }, 30);

        let client = window.kClient;
        let filter = {
            entryIdEqual: this.props.entry.id,
            tagsLike: "skipper"
        };
        delete window.CurrentLoadedCp;
        window.KalturaCuePointService.listAction(filter, null).execute(
            client,
            function(success, results) {
                if (!success || (results && results.code && results.message)) {
                    console.log("Kaltura Error", success, results);
                } else {
                    window.CurrentLoadedCp = results.objects;
                }
            }
        );
    }

    getCurrentTime() {
        if (window.kdp) {
            return window.kdp.evaluate("{video.player.currentTime}");
        }
        return 0;
    }

    componentWillReceiveProps(nextProps) {}
    componentDidMount() {
        window.kWidget.addReadyCallback(function(playerId) {
            // Ready
            window.kdp = document.getElementById(playerId);
        });

        window.kWidget.embed({
            targetId: "kaltura_player_1514902380",
            wid: "_27017",
            uiconf_id: 40888641,
            flashvars: {
                streamerType: "auto"
            },
            cache_st: 1514902380,
            entry_id: this.props.entry.id
        });
    }
    handleChange(event: Event) {}

    render() {
        let skippers = "";
        let showDeader = "hideMe";
        if (this.state.skippers && this.state.skippers.length) {
            showDeader = "";
            skippers = this.state.skippers.map((cp, index) => (
                <Skipper
                    key={index}
                    onEdit={this.onEditCp}
                    skipper={cp}
                    onDeleteCp={this.onDeleteCp}
                />
            ));
        }
        return (
            <div className="container col-12 mt-5">
                <div className="row">
                    {this.props.entry ? this.props.entry.name : "EMPTY"}
                </div>

                <div className="row ">
                    <div className="row col-12">
                        <div className="col-6 ">
                            <div
                                id="kaltura_player_1514902380"
                                ref={div => {
                                    this.player = div;
                                }}
                                style={{ width: "560px", height: "395px" }}
                            />
                        </div>
                        <div className="col-6">
                            <h2>Skippers</h2>
                            <div className={"row " + showDeader}>
                                <div className="col-3">Skipper Text</div>
                                <div className="col-3">Skipper Time</div>
                                <div className="col-3">Skip To</div>
                                <div className="col-3" />
                            </div>
                            {skippers}
                            <Button outline>
                                <PlusIcon /> Add New Skipper
                            </Button>
                        </div>
                    </div>

                    <EditorForm
                        skipper={
                            this.state.currentSkipper
                                ? this.state.currentSkipper
                                : null
                        }
                        entry={this.props.entry}
                        onRefresh={this.listCuePoints}
                        getCurrentTime={this.getCurrentTime}
                    />
                </div>
                <Button outline color="primary" onClick={this.preview}>
                    External Preview
                </Button>
            </div>
        );
    }
}

export default Editor;
