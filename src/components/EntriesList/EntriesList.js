import React, { Component } from "react";
import Entry from "./Entry/Entry";

/**
 *
 */
class EntriesList extends Component {
    // props
    props: {};

    // default values for props
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            searchValue: "",
            entries: []
        };
        this.handleSearch = this.handleSearch.bind(this);
    }

    listEntries(newSearch) {
        window.entriesLoaded = false;
        window.entries = null;
        this.entriesInterval = setInterval(() => {
            if (!window.entriesLoaded && window.entries) {
                window.entriesLoaded = true;
                this.setState({
                    show: this.props.show,
                    entries: window.entries,
                    searchValue: this.state.searchValue
                });
                clearInterval(this.entriesInterval);
            }
        }, 100);

        // var filter = new KalturaMediaEntryFilter();
        var filter = { freeText: this.state.searchValue };
        var pager = null;
        let client = window.kClient;
        window.KalturaMediaService.listAction(
            filter,
            pager
        ).execute(client, function(success, results) {
            if (!success || (results && results.code && results.message)) {
                console.log("Kaltura Error", success, results);
            } else {
                window.entries = results.objects;
                // this.setState({
                //     ks: this.state.ks,
                //     entries: window.entries,
                //     modal: this.state.modal
                // });
            }
        });
    }

    componentWillReceiveProps(props) {
        this.setState({
            show: this.props.show,
            entries: [],
            searchValue: this.state.searchValue
        });
    }
    handleSearch(event: Event) {
        event.preventDefault();
        this.listEntries();
    }

    render() {
        if (!window.entriesLoaded && window.ks !== undefined) {
            this.listEntries();
        }

        let showMe = this.props.show ? "hideMe" : "";
        // return <div className={showMe}>LOADING</div>;
        let entries = this.state.entries.map((entry, index) => (
            <Entry
                entry={entry}
                ks={this.props.ks}
                key={index}
                onEdit={this.handleEdit}
            />
        ));
        return (
            <div className={"container thumb-wrapper mt-1.5 " + showMe}>
                <div className="row " style={{ height: 50 }}>
                    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-success">
                        <img
                            src={"./skipper.png"}
                            style={{ height: 50 }}
                            alt={"logo"}
                        />
                        <div
                            className="collapse navbar-collapse"
                            id="navbarCollapse"
                        >
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item" />
                            </ul>
                            <form
                                className="form-inline mt-2 mt-md-0"
                                onSubmit={this.handleSearch}
                            >
                                <input
                                    className="form-control mr-sm-2"
                                    type="text"
                                    ref={input => {
                                        this.textInput = input;
                                    }}
                                    placeholder="Search U'r entry"
                                    aria-label="Search"
                                />
                                <button
                                    className="btn btn-outline-light my-2 my-sm-0"
                                    type="submit"
                                >
                                    Search
                                </button>
                                <a
                                    className="nav-link text-white small"
                                    href=""
                                    onClick={this.onLogOut}
                                >
                                    Log-out
                                </a>
                            </form>
                        </div>
                    </nav>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col ">{entries}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EntriesList;
