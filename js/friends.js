document.getElementById("addFriendForm").addEventListener("submit", addFriend);

async function addFriend(e) {
    e.preventDefault();
    const friendUser = document.getElementById("addFriendInput").value;

    if (friendUser === "") {
        showToast("Please enter friend username", 2000);
        return;
    }

    try {



    } catch (e) {

    }

}