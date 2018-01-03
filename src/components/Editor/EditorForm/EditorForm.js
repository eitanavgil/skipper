import React, { Component } from "react";
import { Button } from "reactstrap";
import { ArrowDownIcon } from "react-octicons";
import Thumb from "../../Thumb/Thumb";

/**
 *
 */
class EditorForm extends Component {
    // props
    props: {};

    // default values for props
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.closeEditor = this.closeEditor.bind(this);
        this.sampleStart = this.sampleStart.bind(this);
        this.sampleEnd = this.sampleEnd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveSkipper = this.saveSkipper.bind(this);
        this.preview = this.preview.bind(this);

        this.state = {};
    }

    closeEditor() {
        this.props.onClose();
    }
    preview() {
        this.props.onPreview();
    }
    saveSkipper() {
        let o = this.state;
        // validation here
        window.savedCp = null;
        this.saveCpInt = setInterval(() => {
            if (window.savedCp) {
                this.props.onRefresh();
                clearInterval(this.saveCpInt);
            }
        }, 30);
        let cuePoint = {};
        cuePoint.objectType = "KalturaAnnotation";
        cuePoint.entryId = this.props.entry.id;
        cuePoint.startTime = o.start;
        let dsp = "";
        if (o.time) {
            dsp = ',"timeToDisplay":"' + o.time + '"';
        }
        cuePoint.partnerData = '{"text":"' + o.text + '"' + dsp + "}";
        cuePoint.tags = "skipper";
        cuePoint.endTime = o.end;

        let client = window.kClient;
        window.KalturaCuePointService.add(cuePoint).execute(client, function(
            success,
            results
        ) {
            if (!success || (results && results.code && results.message)) {
                console.log("Kaltura Error", success, results);
            } else {
                window.savedCp = true;
            }
        });
    }

    componentWillReceiveProps(props) {
        if (!this.props.skipper) {
            return;
        }

        if (
            props &&
            props.hasOwnProperty("skipper") &&
            props.skipper &&
            props.skipper.hasOwnProperty("startTime")
        ) {
            let o = JSON.parse(props.skipper.partnerData);
            let obj = {
                text: o.text ? o.text : "",
                start: props.skipper.startTime,
                end: props.skipper.endTime,
                time: o.timeToDisplay ? o.timeToDisplay : null
            };

            this.endVal.value = obj.end;
            this.startVal.value = obj.start;
            this.skipperText.value = obj.text;
            this.textInputDisplayFor.value = obj.time;
            this.setState(obj);
        }
    }
    sampleEnd() {
        let obj = {
            text: this.state.text,
            start: this.state.start,
            end: Math.round(this.props.getCurrentTime()),
            time: this.state.time
        };
        this.setState(obj);
        this.endVal.value = Math.round(this.props.getCurrentTime());
    }
    sampleStart() {
        let obj = {
            text: this.state.text,
            start: Math.round(this.props.getCurrentTime()),
            end: this.state.end,
            time: this.state.time
        };
        this.setState(obj);
        this.startVal.value = Math.round(this.props.getCurrentTime());
    }
    handleChange(event: Event) {
        let obj = {
            text: this.skipperText.value,
            start: this.startVal.value,
            end: this.endVal.value,
            time: this.textInputDisplayFor.value
        };

        this.setState(obj);
    }

    render() {
        let ugc = window.ugc ? "" : "hideMe";
        let showStart = this.state.start > 0 ? "" : "hideMe";
        let showEnd = this.state.end > 0 ? "" : "hideMe";
        let hasSkipper = this.props.skipper  ? "" : "hideMe";

        let stf = "";
        let sto = "";
        if (this.state.start) {
            var date = new Date(null);
            date.setSeconds(this.state.start);
            stf = date.toISOString().substr(11, 8);
        }
        if (this.state.end) {
            var date2 = new Date(null);
            date2.setSeconds(this.state.end);
            sto = date2.toISOString().substr(11, 8);
        }

        return (
            <div className={hasSkipper+" container mt-3"}>
                <div className="row">
                    <div className="col-6">
                        <div className="row pl-2">
                            <div className="form-group col-6 pl-0 ">
                                <div className="row pl-2">
                                    <label
                                        className="h5 float-left"
                                        htmlFor="editorSkipperText"
                                    >
                                        Skip From: {stf}
                                    </label>
                                </div>
                                <div className="container pl-0 pr-0 text-left">
                                    <div className="row">
                                        <Button
                                            className="ml-2 mt-2 mb-2 btn-sm text-black "
                                            color="secondary"
                                            onClick={this.sampleStart}
                                        >
                                            <ArrowDownIcon className="arrow-down" />{" "}
                                            Sample Video
                                        </Button>
                                    </div>
                                    <div className="row pl-2">
                                        <input
                                            className="timers-input"
                                            onChange={this.handleChange}
                                            ref={input => {
                                                this.startVal = input;
                                            }}
                                            type={"number"}
                                            defaultValue={this.state.start}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={
                                        "row text-center thumbHolder " +
                                        showStart
                                    }
                                >
                                    <Thumb
                                        entry={this.props.entry}
                                        size={"small"}
                                        type={"3"}
                                        vid_sec={this.state.start}
                                    />
                                </div>
                            </div>

                            <div className="form-group col-6 pl-0">
                                <div className="row pl-2">
                                    <label
                                        className="h5 float-left"
                                        htmlFor="editorSkipperText"
                                    >
                                        Skip To: {sto}
                                    </label>
                                </div>
                                <div className="container pl-0 pr-0 text-left">
                                    <div className="row">
                                        <Button
                                            className="ml-2 mt-2 mb-2 btn-sm text-black "
                                            color="secondary"
                                            onClick={this.sampleEnd}
                                        >
                                            <ArrowDownIcon className="arrow-down" />{" "}
                                            Sample Video
                                        </Button>
                                    </div>
                                    <div className="row pl-2">
                                        <input
                                            className="timers-input"
                                            onChange={this.handleChange}
                                            ref={input => {
                                                this.endVal = input;
                                            }}
                                            type={"number"}
                                            defaultValue={this.state.end}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={
                                        "row text-center thumbHolder " + showEnd
                                    }
                                >
                                    <Thumb
                                        entry={this.props.entry}
                                        size={"small"}
                                        type={"3"}
                                        vid_sec={this.state.end}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 row pl-4">
                        <div className="form-group col-9 ">
                            <label
                                className="float-left"
                                htmlFor="editorSkipperText"
                            >
                                Skippers' Text:
                            </label>
                            <input
                                className="form-control"
                                onChange={this.handleChange}
                                type="text"
                                id="editorSkipperText"
                                ref={input => {
                                    this.skipperText = input;
                                }}
                                defaultValue={this.state.text}
                                placeholder="E.G. Skip Intro"
                                aria-label="Search"
                            />
                        </div>

                        <div className="form-group col-9 ">
                            <label htmlFor="editorSkipperDisplayFor">
                                How Long to display this skipper:
                            </label>
                            <input
                                className="form-control"
                                onChange={this.handleChange}
                                type="text"
                                id="editorSkipperDisplayFor"
                                ref={input => {
                                    this.textInputDisplayFor = input;
                                }}
                                defaultValue={this.state.time}
                                placeholder="Empty For None"
                                aria-label="Search"
                            />
                        </div>
                    </div>
                </div>
                <br />
                <div className="row text-right float-right pr-3">
                    <Button
                        className="float-left"
                        color="info"
                        onClick={this.preview}
                    >
                        Preview
                    </Button>
                    <Button
                        className={"float-right " + ugc}
                        color="primary"
                        onClick={this.saveSkipper}
                    >
                        Save
                    </Button>

                    <Button
                        className={"float-right5 " + ugc}
                        color="primary"
                        onClick={this.saveSkipper}
                    >
                        Save And Close Skipper
                    </Button>
                    <div className="pl-2" />
                    <Button
                        className={"float-right "}
                        color="info"
                        onClick={this.saveSkipper}
                    >
                        Save
                    </Button>
                    <div className="pl-2" />
                    <Button
                        className="float-right"
                        color="success"
                        onClick={this.closeEditor}
                    >
                        Done
                    </Button>
                </div>
            </div>
        );
    }
}

export default EditorForm;
