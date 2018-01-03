import React, { Component } from "react";
import { Button } from "reactstrap";
import Thumb from "../../Thumb/Thumb";

const styles = {
    btn: {
        display: "block",
        margin: "auto"
    },
    entry: {
        marginTop: 30,
        minHeight: 130,
        borderRadius: 6
    }
};

/**
 *
 */
class Entry extends Component {
    // props
    props: {
        ks: string,
        entry: object,
        onEdit: func
    };

    // default values for props
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {}

    handleChange(event: Event) {
        event.preventDefault();
        if (this.props.onEdit) {
            this.props.onEdit(this.props.entry);
        }
    }

    render() {
        let tags = this.props.entry.tags ? this.props.entry.tags : "";
        let tagsJsx = <div />;
        if (tags) {
            tags = tags.split(",");
            tagsJsx = tags.map(item => (
                <span
                    key={item}
                    className="rounded border info pr-2 pt-1 pl-2 pb-1"
                >
                    {item}
                </span>
            ));
        }

        return (
            <div
                className="container w-100 semi-trans entry-item"
                style={styles.entry}
            >
                <div className="col-12 row">
                    <div className="col-3">
                        <Thumb
                            entry={this.props.entry}
                            size={"medium"}
                            type={"3"}
                        />
                    </div>

                    <div className="col-9  ">
                        <div className="pull-left  mr-auto">
                            <span className="h4 text-info text-left ml-2">
                                {this.props.entry.name}
                            </span>
                            <div>{this.props.entry.description}</div>
                            <div>{tagsJsx}</div>
                        </div>

                        <div className="pull-right text-right warning">
                            <Button
                                color="info"
                                style={styles.btn}
                                onClick={this.handleChange}
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Entry;
