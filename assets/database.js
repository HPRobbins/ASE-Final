const database={
	index:function(documentID,callback){
		api.GET(documentID,function(response){
			callback(response.data.users);
		});
	},
	// specifically for pet detail.
	petDetail:function(documentID,petID,callback){
		api.GET(documentID,function(response){
			callback(response.data.pets);
		});
	},
	medicationEdit:function(documentID,index,newData){
		api.GET(documentID,function(response){
			response.data.medications[1]=newData;
			api.PUT(documentID,response.data,function(){
				alert('The medication has been updated');
			});
		});
	},
	medicationDetail:function(documentID,index,callback){
		api.GET(documentID,function(response){
			callback(response.data.medications[1]);
		});
	},
	// this is actually an alteration of database.index
	medicationArray:function(documentID,petID,callback){
		api.GET(documentID,function(response){
			// this should return the /entire/ medicationLog array. Messy, unwieldy, but good enough for now.
			// TODO: fix this to be better. Maybe pass in petID and return array of only medications taken by that pet.
			callback(response.data.medications);
		});
	},
	userUpdate:function(documentID,index,newData){
		api.GET(documentID,function(response){
			response.data.users[index]=newData;
			api.PUT(documentID,response.data,function(){
				alert('The user has been updated. Please go back to the home page');
			});
		});
	},
	petUpdate:function(documentID,index,newData){
		api.GET(documentID,function(response){
			console.log("Index in the get");
			// response.data.pets gets the array of pets back.
			response.data.pets[index]=newData;
			api.PUT(documentID,response.data,function(){
				alert('The pet has been updated. Please go back to the home page');
			});
		});
	},
	userDelete:function(documentID,index){
		api.GET(documentID,function(response){
			response.data.users.splice(index,1);
			api.PUT(documentID,response.data,function(){
				alert('The quote has been deleted. Please go back to the home page');
			});
		});
	},
	petDelete:function(documentID,index){
		api.GET(documentID,function(response){
			response.data.pets.splice(index,1);
			api.PUT(documentID,response.data,function(){
				alert('The quote has been deleted. Please go back to the home page');
			});
		});
	},

}