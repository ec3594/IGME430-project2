const helper = require('./helper.js');

const handleCharacter = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#characterName').value;
    const age = e.target.querySelector('#characterAge').value;
    const characteristic = e.target.querySelector('#characterChar').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if (!name || !age || !characteristic) {
        helper.handleError('ALl fields are requried!');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, characteristic, _csrf }, loadCharactersFromServer);

    return false;
}

const CharacterForm = (props) => {
    return (
        <form id="characterForm"
            name="characterForm"
            onSubmit={handleCharacter}
            action="/maker"
            method="POST"
            className="characterForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="characterName" type="text" name="name" placeholder="Character Name" />

            <label htmlFor="age">Age: </label>
            <input id="characterAge" type="number" min="0" name="age" />

            <label htmlFor="characteristic">Characteristic: </label>
            <input id="characterChar" type="text" name="characteristic" />

            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeCharacterSubmit" type="submit" value="Create" />
        </form>
    );
};

const CharacterList = (props) => {
    if (props.characters.length === 0) {
        return (
            <div className="characterList">
                <h3 className="emptyCharacter">No Characters Yet!</h3>
            </div>
        )
    };

    const characterNodes = props.characters.map(character => {
        return (
            <div key={character._id} className="character">
                <img src="/assets/img/defaultAvatar.jpg" alt="character face" className="characterFace" />
                <h3 className="characterName"> Name: {character.name} </h3>
                <h3 className="characterAge"> Age: {character.age} </h3>
                <h3 className="characterChar"> Characteristic: {character.characteristic} </h3>
                <button id="delete-btn" type="button" onClick={(e) => {
                    console.log("character:");
                    console.log(character);
                    e.target.parentElement.remove();
                    let characterId = character._id;
                    console.log("characterId: " + characterId);
                    const _csrf = document.getElementById("#_csrf").value;
                    helper.sendPost("/delete", { characterId, _csrf });
                }}>X</button>
            </div>
        );
    });

    return (
        <div className="characterList">
            {characterNodes}
        </div>
    )
}

const loadCharactersFromServer = async () => {
    const response = await fetch('/getCharacters');
    const data = await response.json();
    ReactDOM.render(
        <CharacterList characters={data.characters} />,
        document.getElementById('characters')
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
        <CharacterForm csrf={data.csrfToken} />,
        document.getElementById('makeCharacter')
    );

    ReactDOM.render(
        <CharacterList characters={[]} />,
        document.getElementById('characters')
    );

    loadCharactersFromServer();
}

window.onload = init;
