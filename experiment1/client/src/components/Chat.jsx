import { usePlayer } from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React, {useState, useRef, useEffect } from "react";

export function Chat({ scope, attribute, loading}) {
    const player = usePlayer();
    if (!scope || !player) {
        return <LoadingComp />;
    }
    const handleNewMessage = (text) => {
        scope.append(attribute, {
            text,
            likes : {},
            sender: {
                id: player.id,
                name: player.get("name") || player.id,
                avatar: player.get("avatar"),
            },
        });
    };
    let msgs = scope.getAttribute(attribute)?.items || [];
    return (<div className="h-5/6 w-100 justify-center flex flex-col">
      <MessagesPanel scope={scope} msgs={msgs} player={player}/>
      <InputBox onNewMessage={handleNewMessage}/>
    </div>);
}

function MessagesPanel(props) {
    let {player, scope, msgs } = props;
    const scroller = useRef(null);
    const [msgCount, setMsgCount] = useState(0);
    useEffect(() => {
        if (!scroller.current) {
            return;
        }
        if (msgCount !== msgs.length) {
            setMsgCount(msgs.length);
            scroller.current.scrollTop = scroller.current.scrollHeight;
        }
    }, [scroller, props, msgCount]);

    // Handle case before any messages are sent
    if (msgs.length === 0) {
        return (<div className="h-full w-full flex justify-center items-center">
        <div className="flex flex-col justify-center items-center w-2/3 space-y-2">
          <div className="w-24 h-24 text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full fill-current" viewBox="0 0 512 512">
              <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"/>
            </svg>
          </div>

          <h4 className="text-gray-700 font-semibold">No chat yet</h4>

          <p className="text-gray-500 text-center">
            Send a message to start the conversation.
          </p>
        </div>
      </div>);
    }
    return (<div className="h-full overflow-auto pl-2 pr-4 pb-2" ref={scroller}>
        {msgs.map((msg, i) => (<MessageComp key={msg.id} index = {i} player={player} scope={scope} attribute={msg}/>))}
    </div>);
}

//*
// MessageComp is the component showing an individual message
//*
function MessageComp(props) {
    let {player, scope, attribute, index} = props;
    const msg = attribute.value;
    const ts = attribute.createdAt;
    let avatar = msg.sender.avatar;
    if (!avatar) {
        avatar = `https://avatars.dicebear.com/api/identicon/${msg.sender.id}.svg`;
    }

    let avatarImage = (<img className="inline-block h-9 w-9 rounded-full" src={avatar} alt={msg.sender.id}/>);
    if (!avatar.startsWith("http")) {
        avatarImage = (<div className="inline-block h-9 w-9 rounded-full">{avatar}</div>);
    }

    let item = scope.get("chat")[index]
    let handleLike = (e) => {
        e.preventDefault();
        let newLikes = {...item.likes}
        newLikes[player.id] = item.likes[player.id] == 1 ? 0 : 1
        scope.set("chat", {...item, likes: newLikes}, {index: index})
        e.target = e.target.tagName == 'path' ? e.target.parentElement : e.target;
    }
    let likeIcon = (
        <svg onClick={handleLike} className="h-10 w-10" style={{"fill": item.likes[player.id] == 1 ? 'red' : 'none',"stroke":"#303030","strokeWidth":"0.7","strokeLineCap":"round","strokeLinejoin":"round","strokeMiterlimit":"10"}}>
                <path d="M23.99294,15.87192l1.01585-0.88887c1.39679-1.22748,3.11808-1.83417,4.85349-1.83417    c2.03169,0,4.03517,0.83243,5.48839,2.45496c2.59605,2.93467,2.41263,7.35077-0.33862,10.0597l-9.82842,8.73568    c-0.67944,0.60256-1.70193,0.60256-2.38137,0l-9.81431-8.73568c-2.75125-2.69481-2.93467-7.12503-0.33862-10.0597    c1.45322-1.62253,3.4567-2.45496,5.48839-2.45496c1.7213,0,3.4567,0.60669,4.85349,1.83417L23.99294,15.87192"/>
                <path d="M13.97946,19.68624c0.10696-0.4492,0.2748-0.88792,0.50438-1.30326    c0.18132-0.32803,0.40115-0.64148,0.6599-0.93398c1.0309-1.15101,2.45214-1.74152,3.8934-1.74152"/>
                <path d="M14.55714,23.5316c-0.29234-0.49406-0.49641-1.02862-0.61064-1.57971"/>
            </svg>
    )
    return (<div className="flex items-start my-2 shadow p-8">
      <div className="flex-shrink-0">{avatarImage}</div>
      <div className="ml-3 text-sm">
        <p>
          <span className="font-semibold text-gray-900 group-hover:text-gray-800">
            {msg.sender.name}
          </span>

          <span className="pl-2 text-gray-400">{ts && relTime(ts)}</span>
        </p>
        <p className="text-gray-900 group-hover:text-gray-800">{msg.text}</p>
          <p id={scope.get('chat').index} className="flex" style={{'lineHeight': '3.5'}}>
              <span>{likeIcon}</span>
              <span className="pl-2">{Object.values(item.likes).reduce((a,b)=>a+b,0)}</span>
          </p>
      </div>
    </div>);
}


//*
// InputBox is a component for typing and sending messages
//*
function InputBox({ onNewMessage }) {
    const [text, setText] = useState("");
    const resize = (e) => {
        const target = e.target;
        target.style.height = "inherit";
        target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const txt = text.trim();
        if (txt === "") {
            return;
        }
        if (txt.length > 1024) {
            e.preventDefault();
            alert("Max message length is 1024");
            return;
        }
        onNewMessage(txt);
        setText("");
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.shiftKey === false) {
            handleSubmit(e);
            resize(e);
        }
    };
    const handleKeyUp = (e) => {
        resize(e);
    };
    return (
      <form className="p-2 flex items-strech gap-2 border-t" onSubmit={handleSubmit}>
        <textarea name="message" id="message" rows={1}
                  className="peer resize-none bg-transparent block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-empirica-500 sm:text-sm sm:leading-6"
                  placeholder="Say something" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} value={text} onChange={(e) => setText(e.target.value)}
        />

        <button type="button"
                className="rounded-md bg-gray-100 w-9 h-9 p-2 text-sm font-semibold text-gray-500 shadow-sm hover:bg-gray-200 hover:text-empirica-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-empirica-500"
                onClick={handleSubmit}>
          <svg xmlns="http://www.w3.org/2000/svg"
               className="h-full w-full fill-current"
               viewBox="0 0 512 512">
            <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/>
          </svg>
        </button>
    </form>);
}

//*
// relTime is a function that formats the time since the given post (e.g. 2 min ago)
//*
function relTime(date) {
    const difference = (new Date().getTime() - date.getTime()) / 1000;
    if (difference < 60) {
        return `now`;
    }
    else if (difference < 3600) {
        return `${Math.floor(difference / 60)}m`;
    }
    else if (difference < 86400) {
        return `${Math.floor(difference / 3600)}h`;
    }
    else if (difference < 2620800) {
        return `${Math.floor(difference / 86400)} days ago`;
    }
    else if (difference < 31449600) {
        return `${Math.floor(difference / 2620800)} months ago`;
    }
    else {
        return `${Math.floor(difference / 31449600)} years ago`;
    }
}
