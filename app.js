const quotes={
	documentID:'1079866388960788480',
	index:function(){
		database.index(quotes.documentID,function(item){
			for(let i=0;i<item.length;i++){
				let user=item[i];
				let el=document.createElement('div');

				el.innerHTML=`
				<div class="card" style="width: 22rem;">
				<div class="card-body">
			<h5 class="card-title" style="color: #FFCD95; font-size:45px;">${user.firstName} ${user.lastName}</h5>
			  <p class="card-text" style="color: #FFCD95; font-size:20px">${user.emailAddress}</p>
			  <a href="userDetail.html?userID=${user.userID}"  class="btn btn-outline-dark">Details</a>
			</div>`;

				document.getElementById('userdetails').append(el);
			}
		}
		)
	},
	// For fetching the info for petDetail page
	petdetail:function(petID){
		// The info from the JSONBlob at the index is passed in as item, should be 1 pet from the array.
		database.petDetail(quotes.documentID,petID,function(item){
			const cPetID = getAllUrlParams().petid;
			for(let i=0;i<item.length;i++){
				if(item[i].petID==cPetID){
					let pet = item[i];
					document.getElementById('loading').style.display='none';
					// document.getElementById('pet-photo').innerHTML=`<div id="petPhoto" class="col">${pet.petPhoto}</div>`;
					document.getElementById('pet-ident').innerHTML=`<div class="row justify-content-start">
							<div id="petID" class="col-4">ID #: ${pet.petID}</div>
							<div id="petName" class="col-4">Name: ${pet.petName}</div>
						</div>`;
					document.getElementById('pet-kind').innerHTML=`<div class="row justify-content-start">
							<div id="petSpecies" class="col-4">Species: ${pet.petType}</div>
							<div id="petBreed" class="col-4">Breed: ${pet.petBreed}</div>
						</div>`;
					document.getElementById('pet-stats').innerHTML=`<div class="row justify-content-start">
							<div id="petSex" class="col-4">Sex: ${pet.petSex}</div>
							<div id="petDoB" class="col-4">Date of Birth: ${pet.petDoB}</div>
							<div id="petWeight" class="col-4">Weight: ${pet.petWeight}</div>
						</div>`;
					document.getElementById('btn-edit').setAttribute('href',`petEdit.html?petID=${cPetID}`);
				}
			}

			// This should add all medications taken by the pet as cards. Pagination can be added later.
			// creates a card and APPENDS it to the innerHTML to create multiple cards.
			// run a loop through medications, check that userID and petID in medication object matches current pet.
			database.medicationArray(quotes.documentID,cPetID,function(item){
				for(let i=0;i<item.length;i++){
					// if PetID matches, add medication page
					if(item[i].petID==cPetID){
						document.getElementById('medication-pages').innerHTML+=`<div "col-sm-6">
							<div class="card" style="width: 18rem;">
							<div class="card-body">
							<h5 class="card-title">${item[i].medicationName}</h5>
							<h6 class="card-subtitle mb-2 text-muted">${item[i].medType}</h6>
							<p class="card-text">Dose Amount: ${item[i].dosage}</p><p class="card-text">Timing: ${item[i].numberOfDailyDoses}</p>
							<p class="card-text">Notes: ${item[i].medNotes}</p>
								</div>
							</div>
						</div>`
					}
					else{
						break;
					}
				}
			});

			let deleteButton=document.getElementById('btn-delete');
			deleteButton.addEventListener('click',function(){
				database.petDelete(quotes.documentID,index);
			});
		});
	},
	userDelete:function(documentID,index){
		api.GET(documentID,function(response){
			response.data.users.splice(index,1);
			api.PUT(documentID,response.data,function(){
				alert('The user has been deleted. Please go back to the home page');
			});
		});
	},
	userupdate:function(index){
		database.petDetail(quotes.documentID,index,function(item){
			document.getElementById('loading').style.display='none';
			document.querySelector('form input[name=userFirstNameInput]').value=item.userFirstNameInput;
			document.querySelector('form input[name=userLastNameInput]').value=item.userLastNameInput;
			document.querySelector('form input[name=userEmailInput]').value=item.userEmailInput;

			document.querySelector('form').addEventListener('submit',function(e){
				e.preventDefault();
				let userFirstName=document.querySelector('form input[name=userFirstNameInput]');
				let userLastName=document.querySelector('form input[name=userLastNameInput]');
				let userEmail=document.querySelector('form input[name=userEmailInput]');

				let newUser={
					userFirstName:item.firstName,
					userLastName:item.lastName,
					userEmail:item.emailAddress
				}
				database.userUpdate(quotes.documentID,index,newUser);
			});
		});
	},
	medupdates:function(index){
		database.medicationDetail(quotes.documentID,index,function(item){
			console.log(item);
			document.querySelector('form input[name=medicationName]').value=item.medicationName;
			document.querySelector('form input[name=medType]').value=item.medType;
			document.querySelector('form input[name=dosage]').value=item.dosage;
			document.querySelector('form input[name=numberOfDailyDoses]').value=item.numberOfDailyDoses;
			document.querySelector('form input[name=medNotes]').value=item.medNotes;
			document.querySelector('form input[name=medicationID]').value=item.medicationID;

			document.querySelector('form').addEventListener('submit',function(e){
				e.preventDefault();
				let medicationName=document.querySelector('form input[name=medicationName]');
				let medType=document.querySelector('form input[name=medType]');
				let dosage=document.querySelector('form input[name=dosage]');
				let numberOfDailyDoses=document.querySelector('form input[name=numberOfDailyDoses]');
				let medNotes=document.querySelector('form input[name=medNotes]');
				let medicationID=document.querySelector('form input[name=medicationID]');

				let newMed={
					medicationName:medicationName.value,
					medType:medType.value,
					dosage:dosage.value,
					numberOfDailyDoses:numberOfDailyDoses.value,
					medNotes:medNotes.value,
					medicationID:medicationID.value,
				}
				database.medicationEdit(quotes.documentID,index,newMed);
			});
		});
	},
	petupdate:function(petID){
		database.petDetail(quotes.documentID,petID,function(item){
			const cPetID = getAllUrlParams().petid;
			//
			document.getElementById('loading').style.display='none';
			for(let i=0;i<item.length;i++)
			{
				// if the item in the array matches the passed in PetID then write the information to the form.
				if(item[i].petID==cPetID){
					document.querySelector('form input[name=petName]').value=item[i].petName;
					document.querySelector('form input[name=userID]').value=item[i].userID;
					document.querySelector('form input[name=petTye]').value=item[i].petType;
					document.querySelector('form input[name=petBreed]').value=item[i].petBreed;
					document.querySelector('form input[name=petSex]').value=item[i].petSex;
					document.querySelector('form input[name=petDoB]').value=item[i].petDoB;
					document.querySelector('form input[name=petWeight]').value=item[i].petWeight;
				}
				else{
					// do nothing
				}
			}

			// this makes the button work.
			document.querySelector('form').addEventListener('submit',function(e){
				e.preventDefault();
				let petName=document.querySelector('form input[name=petName]');
				let userID=document.querySelector('form input[name=userID]');
				let petType=document.querySelector('form input[name=petTye]');
				let petBreed=document.querySelector('form input[name=petBreed]');
				let petSex=document.querySelector('form input[name=petSex]');
				let petDoB=document.querySelector('form input[name=petDoB]');
				let petWeight=document.querySelector('form input[name=petWeight]');
				// petID purposely stays the same.
				let newPet={
					petID:cPetID,
					userID:userID.value,
					petName:petName.value,
					petType:petType.value,
					petSex:petSex.value,
					petBreed:petBreed.value,
					petWeight:petWeight.value,
					petDoB:petDoB.value,
				}
				database.petUpdate(quotes.documentID,cPetID,newPet);
			});
		});
	}
}
