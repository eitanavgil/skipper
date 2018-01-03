import React, { Component } from "react";
import { Button } from "reactstrap";
import { PencilIcon, TrashcanIcon } from "react-octicons";

/**
 *
 */
class Skipper extends Component {
    // props
    props: {};

    // default values for props
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            isHovering: false
        };
        this.handleMouseHover = this.handleMouseHover.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {}

    handleEdit(event: Event) {
        this.props.onEdit(this.props.skipper)
    }
    handleDelete(event: Event) {
        window.deleteCP = null;
        this.deleteCP = setInterval(() => {
            if (window.deleteCP) {
                if(this.props.onDeleteCp){
                    this.props.onDeleteCp();
                }
                clearInterval(this.deleteCP);
            }
        }, 30);

        let client = window.kClient;
        window.KalturaCuePointService.deleteAction(this.props.skipper.id).execute(client, function(
            success,
            results
        ) {
            if (!success || (results && results.code && results.message)) {
                console.log("Kaltura Error", success, results);
            } else {
                window.deleteCP = true;
            }
        });




    }
    handleChange(event: Event) {}
    toggleHoverState(state) {
        return {
            isHovering: !state.isHovering
        };
    }
    handleMouseHover() {
        this.setState(this.toggleHoverState);
    }

    render() {
        let shouldHide = this.state.isHovering ? "" : "hideMe";
        let highlighted = this.state.isHovering ? "hoverme" : "";
        let obj = JSON.parse(this.props.skipper.partnerData)
        let text = obj.text ? obj.text : "Skip Intro";
        // let timeToDisplay = obj.hasOwnProperty("timeToDisplay") ? obj.timeToDisplay.text : 0;
        return (
            <div
                className={"row pt-1 pb-1 ml-0 mr-0 skipper border-top-1 " + highlighted}
                onMouseEnter={this.handleMouseHover}
                onMouseLeave={this.handleMouseHover}
            >

                <div className="col-3"><small>{text}</small></div>
                <div className="col-3"><small>{this.props.skipper.startTime}</small></div>
                <div className="col-3"><small>{this.props.skipper.endTime}</small></div>
                <div className={"col-3 " + shouldHide}>
                    <Button
                        outline
                        color="white"
                        className="btn-sm"
                        onClick={this.handleEdit}
                    >
                        <PencilIcon />
                    </Button>
                    <Button
                        outline
                        color="white"
                        className="btn-sm"
                        onClick={this.handleDelete}
                    >
                        <TrashcanIcon />
                    </Button>
                    {/*<Button*/}
                        {/*outline*/}
                        {/*color="white"*/}
                        {/*className="btn-sm"*/}
                        {/*onClick={this.handlePreview}*/}
                    {/*>*/}
                        {/*<DeviceCameraIcon />*/}
                    {/*</Button>*/}
                </div>
            </div>
        );
    }
}

export default Skipper;
