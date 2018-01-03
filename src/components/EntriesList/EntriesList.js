import React, { Component } from "react";
import Entry from "./Entry/Entry";
import Editor from "../Editor/Editor";

// const styles = { modal: { width: "100%" } };

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
            selectedEntry: null,
            entries: []
        };
        this.handleClose = this.handleClose.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleClose() {
        this.setState({
            show: this.state.show,
            entries: this.state.entries,
            selectedEntry: null,
            searchValue: this.state.searchValue
        });
    }
    toggle() {
        this.setState({
            show: this.props.show,
            entries: window.entries,
            selectedEntry: null,
            searchValue: this.state.searchValue
        });
    }

    listEntries() {
        window.entriesLoaded = false;
        window.entries = null;
        this.entriesInterval = setInterval(() => {
            if (!window.entriesLoaded && window.entries) {
                window.entriesLoaded = true;
                this.setState({
                    show: this.props.show,
                    entries: window.entries,
                    selectedEntry: null,
                    searchValue: this.state.searchValue
                });
                clearInterval(this.entriesInterval);
            }
        }, 100);

        // var filter = new KalturaMediaEntryFilter();
        var filter = { freeText: this.textInput.value, orderBy: "-createdAt" };
        var pager = null;
        let client = window.kClient;
        window.KalturaMediaService.listAction(filter, pager).execute(
            client,
            function(success, results) {
                if (!success || (results && results.code && results.message)) {
                    console.log("Kaltura Error", success, results);
                } else {
                    window.entries = results.objects;
                }
            }
        );
    }

    componentWillReceiveProps(props) {
        this.setState({
            show: this.props.show,
            entries: [],
            selectedEntry: null,
            searchValue: this.state.searchValue
        });
    }
    handleSearch(event: Event) {
        event.preventDefault();
        this.listEntries();
    }
    handleEdit(entryId) {
        this.setState({
            show: this.state.show,
            entries: this.state.entries,
            searchValue: this.state.searchValue,
            selectedEntry: entryId
        });
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
        let displayEditor = this.state.selectedEntry ? "" : "hideMe";
        let displayList = this.state.selectedEntry ? "hideMe" : "";
        return (
            <div className={"entries-list mt-1.5 w-100 h-100" + showMe}>
                <div className={"w-100 " + displayEditor}>
                    <Editor entry={this.state.selectedEntry} onClose={this.handleClose} />
                </div>

                <div className={"row " + showMe} style={{ height: 50 }}>
                    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-info">
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

                <div className={"container " + displayList}>
                    <div className="row">
                        <div className="col ">{entries}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EntriesList;
