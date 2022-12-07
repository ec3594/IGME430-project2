const helper = require('./helper.js');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const characteristic = e.target.querySelector('#domoChar').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!name || !age || !characteristic) {
        helper.handleError('ALl fields are requried!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, characteristic, _csrf }, loadDomosFromServer);

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            name="domoForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Character Name" />

            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />

            <label htmlFor="characteristic">Characteristic: </label>
            <input id="domoChar" type="text" name="characteristic" />

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Create" />
        </form>
    );
};

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Characters Yet!</h3>
            </div>
        )
    };

    const domoNodes = props.domos.map(domo => {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/defaultAvatar.jpg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3>
                <h3 className="domoChar"> Characteristic: {domo.characteristic} </h3>
                <button id="delete-btn" type="button" onClick={(e) => {
                    console.log("domo:");
                    console.log(domo);
                    e.target.parentElement.remove();
                    let domoId = domo._id;
                    console.log("domoId: " + domoId);
                    const _csrf = document.getElementById("#_csrf").value;
                    helper.sendPost("/delete", { domoId, _csrf });
                }}>X</button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    )
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
}

let currentRole = "";

// send button used for sendign messages
function sendButtonClicked() {
    let messages = document.querySelector("#message-container");

    console.log("btn clicked");

    // if the user actually typed something
    if (textbox.value != "") {

        // create 4 elements needed
        let messageBox = document.createElement("div");
        let message = document.createElement("div");
        let name = document.createElement("div");
        let avatar = document.createElement("div");

        // set their class names
        messageBox.className = "messageBox";
        message.className = "message";
        name.className = "name";
        avatar.className = "avatar";
        avatar.innerHTML = '<i class="fas fa-user"></i>';

        // set the text of the new message to what the user has in the inpur field
        message.innerHTML = textbox.value;

        // set the current role name (just above the input field) to the current role
        name.innerHTML = currentRole;

        // append the 3 components to the new message box
        messageBox.appendChild(name);
        messageBox.appendChild(avatar);
        messageBox.appendChild(message);

        // append the new message box to the list of all messages
        messages.appendChild(messageBox);

        // reset textbox value
        textbox.value = "";
    }
    // keep the cursor in the textbox
    textbox.focus();

    // scroll to the bottom
    messages.scrollTop= messages.scrollHeight;
}

// allow user to send message by pressing Enter
function enterKeyPressed(e) {
    if (e.key == "Enter") {
        sendButtonClicked();
    }
}

const init = async () => {
    const response = await fetch('./getToken');
    const data = await response.json();

    console.log("in init of maker");
    const sendBtn = document.querySelector("#sendButton");
    const textbox = document.querySelector("#textbox");
    // let messages = document.querySelector("#message-container");
    sendBtn.addEventListener("click", sendButtonClicked);
    textbox.addEventListener("keydown", enterKeyPressed);
    currentRole = "System";
    // keep the cursor in the textbox
    textbox.focus();

    ReactDOM.render(
        <DomoForm csrf={data.csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
}

window.onload = init;
