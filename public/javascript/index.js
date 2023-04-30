    function write(users){
        for(let i=0;i<users.length;i++){
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