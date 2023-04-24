//Function to get json
async function fetchFunction(){
  // Fetch the JSON 
  const response = api.GET('1079866388960788480', function(response) { 
      const userID = getAllUrlParams().userid;
      //Create an Array containting the medication object with the matching ID
      let users = response.data.users.filter(function (userList){
          return userList.userID === userID;
      });
      
      //Set the only element in created array to a constant
      const user = users[0];
      writeForm(user);
     }); 
     
}

function writeForm(user){
document.getElementById('formDiv').innerHTML +=`
<div id="BackToUser">
<a href="userDetail.html?userID=${user.userID}">Back to User Details</a>
</div>
<div id="form">
<div class="mb-3">
<label for="petNameFeild" class="form-label">Pet Name</label>
<input type="petName" class="form-control" id="petNameFeild">
</div>
<div class="mb-3">
<label for="petTypeFeild" class="form-label">Pet Type</label>
<input type="petType" class="form-control" id="petTypeFeild">
</div>
<div class="mb-3">
<label for="petBreedFeild" class="form-label">Pet Breed</label>
<input type="petBreed" class="form-control" id="petBreedFeild">
</div>
<div class="mb-3">
<label for="petSexFeild" class="form-label">Pet Gender</label>
<input type="petSex" class="form-control" id="petSexFeild">
</div>
<div class="mb-3">
<label for="petWeightFeild" class="form-label">Pet Weight</label>
<input type="petWeight" class="form-control" id="petWeightFeild">
</div>
<div class="mb-3">
<label for="petDoBFeild" class="form-label">Pet Date of Birth</label>
<input type="petDoB" class="form-control" id="petDoBFeild">
</div>
<div class="col-auto">
<button type="submit" class="btn btn-primary mb-3">Add Pet</button>
</div></div>
</div>`};

const createPet = function(){
  document.querySelector('form').addEventListener('submit',function(e){
      e.preventDefault();
      let petName=document.querySelector('form input[name=petName]');
      let petType=document.querySelector('form textarea[name=petType]');
      let petSex=document.querySelector('form input[name=petSex]');
      let petBreed=document.querySelector('form textarea[name=petBreed]');
      let petWeight=document.querySelector('form input[name=petWeight]');
      let petDoB=document.querySelector('form textarea[name=petDoB]');
      let newPet={
          //Add Pet ID
          userID: user.userID,
          petName: petName.value,
          petType: petType.value,
          petSex: petSex.value,
          petBreed: petBreed.value,
          petWeight: petWeight.value,
          petDoB: petDoB.value
      }
      database.create(response.documentID,newPet);
  });
}
document.addEventListener('DOMContentLoaded', async () => await fetchFunction(), false);