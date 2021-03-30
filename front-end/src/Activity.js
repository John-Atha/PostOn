import React from 'react';
import ProfileCard from './ProfileCard';
import {isLogged, getActivity} from './api';
import './Activity.css';
import MyNavbar from './MyNavbar';

const dateShow = (date) => {
    let datetime = date.replace('T', ' ').replace('Z', '').split(' ')
    let day = datetime[0]
    let time = datetime[1].substring(0, 8)
    return `${day} ${time}`

}

class CommentAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: this.props.action.owner,
            post: this.props.action.post,
            text: this.props.action.text,
            date: this.props.action.date,
            showCard: false,
        }
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
    }
    cardShow = () => {
        this.setState({
            mouseOutLink: false,
            mouseOutCard: false,
            showCard: true,
        })
    }
    cardHide = () => {
        this.setState({
            showCard: false,
        })
    }
    render() {
        return(
            <div className="one-activity-container">
                <div className="description flex-layout">
                    <div className="with-whitespace">
                        On {dateShow(this.state.date)}, you commented on a
                    </div>
                    <a href={`/posts/${this.state.post.id}`} className="with-whitespace">
                        {" post "}
                    </a>
                    <div>
                        of user 
                    </div>
                    <a href="#" className="with-whitespace"
                        onMouseEnter={this.cardShow}
                        onMouseLeave={this.cardHide}>
                        {" "+this.state.post.owner.username}
                        {this.state.showCard &&
                                <ProfileCard id={this.state.post.owner.id}
                                     username={this.state.post.owner.username}
                                     moto={this.state.post.owner.moto}
                                     photo={this.state.post.owner.photo}
                                     position={"right"} />
                        }
                    </a>.
                </div>
                <div className="margin-top-smaller">
                    {this.state.text}
                </div>
            </div>
        )
    }
}

class PostLikeAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: this.props.action.owner,
            post: this.props.action.post,
            date: this.props.action.date,
        }
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
    }
    cardShow = () => {
        this.setState({
            mouseOutLink: false,
            mouseOutCard: false,
            showCard: true,
        })
    }
    cardHide = () => {
        this.setState({
            showCard: false,
        })
    }
    render() {
        return(
            <div className="one-activity-container">
                <div className="description flex-layout">
                    <div className="with-whitespace">
                        On {dateShow(this.state.date)}, you liked a
                    </div>
                    <a href={`/posts/${this.state.post.id}`} className="with-whitespace">
                        {" post "}
                    </a>
                    <div>
                        of user 
                    </div>
                    <a href="#" className="with-whitespace"
                        onMouseEnter={this.cardShow}
                        onMouseLeave={this.cardHide}>
                        {" "+this.state.post.owner.username}
                        {this.state.showCard &&
                                <ProfileCard id={this.state.post.owner.id}
                                     username={this.state.post.owner.username}
                                     moto={this.state.post.owner.moto}
                                     photo={this.state.post.owner.photo}
                                     position={"right"} />
                        }
                    </a>
                </div>
            </div>
        )
    }
}

class CommentLikeAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: this.props.action.owner,
            comment: this.props.action.comment,
            date: this.props.action.date,
            showCard: false,
        }
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
    }
    cardShow = () => {
        this.setState({
            mouseOutLink: false,
            mouseOutCard: false,
            showCard: true,
        })
    }
    cardHide = () => {
        this.setState({
            showCard: false,
        })
    }
    render() {
        return(
            <div className="one-activity-container">
                <div className="description flex-layout">
                    <div className="with-whitespace">
                        On {dateShow(this.state.date)}, you liked a
                    </div>
                    <a href={`/posts/${this.state.comment.post.id}`} className="with-whitespace">
                        {" comment "}
                    </a>
                    <div>
                        of user 
                    </div>
                    <a href="#" className="with-whitespace"
                        onMouseEnter={this.cardShow}
                        onMouseLeave={this.cardHide}>
                        {" "+this.state.comment.owner.username}
                        {this.state.showCard &&
                                <ProfileCard id={this.state.comment.owner.id}
                                     username={this.state.comment.owner.username}
                                     moto={this.state.comment.owner.moto}
                                     photo={this.state.comment.owner.photo}
                                     position={"right"} />
                        }
                    </a>.
                </div>
                <div className="margin-top-smaller">
                    {this.state.comment.text}
                </div>

            </div>
        )
    }
}

class PostAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: this.props.action.owner,
            post: this.props.action,
            date: this.props.action.date,
        }
    }
    render() {
        return(
            <div className="one-activity-container">
                <div className="description flex-layout">
                    <div className="with-whitespace">
                        On {dateShow(this.state.date)}, you uploaded a
                    </div>
                    {this.state.post!==null &&
                        <a href={`/posts/${this.state.post.id}`} className="with-whitespace">
                            {" post "}.
                        </a>
                    }
                </div>
            </div>
        )
    }
}

class FollowAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: this.props.action.owner,
            followed: this.props.action.followed,
            date: this.props.action.date,
            showCard: false,
        }
        this.cardShow = this.cardShow.bind(this);
        this.cardHide = this.cardHide.bind(this);
    }
    cardShow = () => {
        this.setState({
            mouseOutLink: false,
            mouseOutCard: false,
            showCard: true,
        })
    }
    cardHide = () => {
        this.setState({
            showCard: false,
        })
    }
    render() {
        return(
            <div className="one-activity-container">
                <div className="description flex-layout">
                    <div className="with-whitespace">
                        On {dateShow(this.state.date)}, you followed the user
                    </div>
                    <a href="#" className="with-whitespace"
                                onMouseEnter={this.cardShow}
                                onMouseLeave={this.cardHide}>
                        {" "+this.state.followed.username}
                        {this.state.showCard &&
                                <ProfileCard id={this.state.followed.id}
                                     username={this.state.followed.username}
                                     moto={this.state.followed.moto}
                                     photo={this.state.followed.photo}
                                     position={"right"} />
                        }
                    </a>.
                </div>
            </div>
        )
    }
}

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            logged: null,
            actList: [],
            start: 1,
            end: 10,
            error: null,
        }
        this.askActivity = this.askActivity.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.moveOn = this.moveOn.bind(this);
    }

    moveOn = () => {
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        });
        setTimeout(() => this.askActivity(), 500);
    }
    previousPage = () => {
        setTimeout(this.setState({
            start: this.state.start-10,
            end: this.state.end-10,
        }), 0)
        this.moveOn();
    }
    nextPage = () => {
        setTimeout(this.setState({
            start: this.state.start+10,
            end: this.state.end+10,
        }), 0)
        this.moveOn();
    }

    askActivity = () => {
        console.log(`I am asking activity from ${this.state.start} to ${this.state.end}`)
        getActivity(this.state.userId, this.state.start, this.state.end)
        .then(response=> {
            console.log(response);
            this.setState({
                actList: response.data,
            })
        })
        .catch(err => {
            console.log(err);
            this.setState({
                error: "No more activity found",
            })
        })
    }

    componentDidMount() {
        isLogged()
        .then(response => {
            console.log(response);
            this.setState({
                logged: response.data.authenticated,
                userId: response.data.id,
            })
            setTimeout(()=>{this.askActivity();}, 2000);
        })
        .catch(err => {
            console.log(err)
            this.setState({
                error: "Not logged in"
            })
        })
    }

    render() {
        return (
        <div className="all-page padding-bottom">
            <MyNavbar />
            <div className="main-activity-container flex-layout">
                {this.state.actList.map((value, index) => {
                    if (value.post && value.text) {
                        return(
                            <CommentAction key={index} action={value} />
                        )
                    }
                    else if (value.comment) {
                        return(
                            <CommentLikeAction key={index} action={value} />
                        )
                    }
                    else if (value.text) {
                        return(
                            <PostAction key={index} action={value} />
                        ) 
                    }
                    else if (value.following) {
                        return(
                            <FollowAction key={index} action={value} />
                        ) 
                    }
                    else {
                        return(
                            <PostLikeAction key={index} action={value} />
                        )
                    }

                })}
            </div>
            {this.state.actList.length &&
                <div className="pagi-buttons-container flex-layout center-content">
                    <button disabled={this.state.start===1} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.previousPage}>Previous</button>
                    <button disabled={!this.state.actList.length} className="flex-item-small my-button pagi-button margin-top-small" onClick={this.nextPage}>Next</button>
                </div>
            }
            {!this.state.actList.length &&
                <div className="error-message margin-top center-text">Oops, no activity found..</div>
            }

        </div>


        )
    }


}

export default Activity;