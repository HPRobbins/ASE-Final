
// 
//Function to get json
async function fetchFunction(){
    // Fetch the JSON 
    const response = api.GET('1079866388960788480', function(response) {
        //get user's ID
        const userID = getAllUrlParams().userid;
        //Create an Array containting the user object with the matching ID
        let users= response.data.users.filter(function (userPetsList){
            return userPetsList.userID === userID;
        });
        //Set the only element in created array to a constant
        const user = users[0];
console.log(user);
    //Create an Array containting the pet object with the matching ID
       let pets = response.data.pets.filter(function (petList){
            return petList.userID === user.userID;
        });
        //Set the only element in created array to a constant
        const pet= pets[0];
        writeToDiv(user,pet);
    }); 
}
// write information to html divs passing in pet const
function writeToDiv(user,pet){
    document.getElementById('loading').style.display='none';
    
    document.getElementById('nameOfUser').innerHTML=`<h5 class="card-title" id="nameOfUser">${user.firstName} ${user.lastName}`;
    document.getElementById('userEmail').innerHTML=`<h5 class="card-title" id="nameOfUser" style="font-size:0.775em;">${user.emailAddress}`;
    document.getElementById('listOfUserPets').innerHTML=`<p class="card-text" id="listOfUserPets">
        <a style="text-decoration:none;" class="link-dark" href="petDetail.html?petID=${pet.petID}"><mark style="border-radius: 10px;">${pet.petName}</a></mark>`;
    
};




document.addEventListener('DOMContentLoaded', async () => await fetchFunction(), false);