// 
//Function to get json
async function fetchFunction(){
    // Fetch the JSON 
    const response = api.GET('1079866388960788480', function(response) {
        const medicationID = getAllUrlParams().medicationid;
        //Create an Array containting the medication object with the matching ID
        let medications= response.data.medications.filter(function (medList){
            return medList.medicationID === medicationID;
        });
        //Set the only element in created array to a constant
        const med = medications[0];
        //Create an Array containting the pet object with the matching ID
        let pets = response.data.pets.filter(function (petList){
            return petList.petID === med.petID;
        });
        //Set the only element in created array to a constant
        const pet= pets[0];
        writeToDiv(med,pet);
        let deleteButton = document.getElementById('btn-delete');
			deleteButton.addEventListener('click', function() {
				const findIndex = response.data.medications.findIndex((object) => {
                    return object.medicationID === medicationID;
                    
                })
                if (findIndex > -1) {
                    response.data.medications.splice(findIndex, 1);
                  }
                  console.log(response.data.medications);
                  api.PUT('1079866388960788480',response.data, function(response) {
                    if(response.status === 200) {
                        document.location.href = window.location.protocol + '//' + window.location.host + '/index.html';
                    }
                  }); 
           });
           
    }); 
}
// write information to html divs passing in the two const med and pet
function writeToDiv(med,pet){
    document.getElementById('medInfo').innerHTML +=`
    <div id="medName" class="container">
        <h1>${med.medicationName}</h1>
        <div id="medicationDetails" class="container">
            Medication ID: ${med.medicationID}<br />
            Medication Type: ${med.medType}<br />
            Pet: ${pet.petName}<br />
            Dosage: ${med.dosage}<br />
            Number of Doses a day: ${med.numberOfDailyDoses}<br />
            Medication Notes: ${med.medNotes}<br />
    </div>
    <div id="buttons" class="col-12">
    <a href="petDetail.html?petID=${pet.petID}">Back to Pet</a> | <a id="btn-edit" href="MedicationEdit.html?${med.medicationID}">Edit Info</a> | <button type="button" id="btn-delete">Delete Info</button>
    </div>`;
};
function medDelete(data, med){
    api.GET(documentID,function(response){
        data.splice(med.medicaitonID);
        api.PUT(documentID,response.data,function(){
            alert('This Medication has been deleted. Please go back to the home page');
        });
    });
}
document.addEventListener('DOMContentLoaded', async () => await fetchFunction(), false);