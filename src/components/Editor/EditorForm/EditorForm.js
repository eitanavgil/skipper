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

        this.state = {
            text: "Skip Intro",
            start: 0,
            end: 0,
            time: null
        };
    }

    closeEditor() {
        this.props.onClose();
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
        return (
            <div className="container mt-3">
                <div className="row">
                    <div className="col-6">
                        <div className="row">
                            <div className="form-group col-6 pl-0 ">
                                <label
                                    className="h4 float-left"
                                    htmlFor="editorSkipperText"
                                >
                                    Skip From:
                                </label>
                                <input
                                    className="timers-input"
                                    onChange={this.handleChange}
                                    ref={input => {
                                        this.startVal = input;
                                    }}
                                    type={"number"}
                                    defaultValue={this.state.start}
                                />

                                <Button
                                    className="ml-2"
                                    outline
                                    color="secondary"
                                    onClick={this.sampleStart}
                                >
                                    <ArrowDownIcon />
                                </Button>
                                <div className={"row text-center thumbHolder "+showStart}>
                                    <Thumb
                                        entry={this.props.entry}
                                        size={"small"}
                                        type={"3"}
                                        vid_sec={this.state.start}
                                    />
                                </div>
                            </div>

                            <div className="form-group col-6 pl-0">
                                <label
                                    className="h4 float-left"
                                    htmlFor="editorSkipperText"
                                >
                                    Skip To:
                                </label>
                                <input
                                    className="timers-input"
                                    onChange={this.handleChange}
                                    ref={input => {
                                        this.endVal = input;
                                    }}
                                    type={"number"}
                                    defaultValue={this.state.end}
                                />
                                <Button
                                    className="ml-2"
                                    outline
                                    color="secondary"
                                    onClick={this.sampleEnd}
                                >
                                    <ArrowDownIcon />
                                </Button>
                                <div className={"row text-center thumbHolder "+showEnd}>
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
                        <div className="form-group ">
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

                        <div className="form-group ">
                            <label htmlFor="editorSkipperDisplayFor">
                                How Long to display this skipper:
                            </label>
                            <input
                                className="form-control"
                                onChange={this.handleChange}
                                type="Number"
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
                        className={"float-right " + ugc}
                        color="primary"
                        onClick={this.saveSkipper}
                    >
                        Save
                    </Button>
                    <div className="pl-2" />
                    <Button
                        className={"float-right " + ugc}
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
                        Suggest a Skipper
                    </Button>
                    <div className="pl-2" />
                    <Button
                        className="float-right"
                        color="danger"
                        onClick={this.closeEditor}
                    >
                        Close
                    </Button>
                </div>
            </div>
        );
    }
}

export default EditorForm;
