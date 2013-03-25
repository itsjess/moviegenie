movie={"genres":{}};

movie.init=function(){
   movie.getGenres();
   //$(".movieOption").click(function(){$("#genre").fadeOut();});
}

movie.loadConsole=function(){
   $("#genie").append("<span id=dir>Select Genre:<span></br>");
   $("#genie").append("<div id=\"genre\"><div class=\"movieOption "+
	"genreOption\" id=\""+movie.genres["Action"]+"\"> Action</div>"+
	"<div class=\"movieOption genreOption\""+"id=\""+movie.genres["Comedy"]+	"\">Comedy</div><div class=\"movieOption genreOption\" id=\""+
	movie.genres["Romance"]+"\">Romance</div><div class=\"movieOption"+
	" genreOption\" id=\""+movie.genres["Horror"]+"\">Horror</div>"+
	"<div class=\"movieOption genreOption\" id=\""+
	movie.genres["Science Fiction"]+"\">Sci-fi</div><div "+
	"class=\"movieOption genreOption\" id=\""+movie.genres["Animation"]+
        "\">Animation</div></div>");
   $("#genie").append("<div id=\"ageRating\"><div class=\"movieOption "+
	"ageOption\" id=\"G\">G</div><div class=\"movieOption ageOption"+
	"\" id=\"PG\">PG</div><div class=\"movieOption ageOption\" "+
	"id=\"PG-13\">PG-13</div><div class=\"movieOption ageOption\""+
	" id=\"R\">R</div></div>");
   $("#genie").append("<div id=\"minRating\"><div class=\"movieOption "+
	"minOption\" id=\"1\">1</div><div class=\"movieOption "+
        "minOption\" id=\"2\">2</div><div class=\"movieOption "+
        "minOption\" id=\"3\">3</div><div class=\"movieOption "+
        "minOption\" id=\"4\">4</div><div class=\"movieOption "+
        "minOption\" id=\"5\">5</div><div class=\"movieOption "+
        "minOption\" id=\"6\">6</div><div class=\"movieOption "+
        "minOption\" id=\"7\">7</div><div class=\"movieOption "+
        "minOption\" id=\"8\">8</div><div class=\"movieOption "+
        "minOption\" id=\"9\">9</div></div>");
   $("#genie").append("<div id=\"results\"></div>");
   $("#results").css("visibility","hidden");
   $("#genie").append("<div id=\"reset\">Start Over</div>");
   $(".genreOption").click(function(){
	$("#reset").css("visibility","visible");
	movie.theGenre=$(this).attr('id');
	$("#dir").html("Select Age Rating:");
	$("#genre").css("visibility","hidden");
	$("#ageRating").css("visibility","visible");
	});
   $(".ageOption").click(function(){
	movie.theAgeRating=$(this).attr('id');
	$("#dir").html("Select Minimum Rating:");
	$("#ageRating").css("visibility","hidden");
	$("#minRating").css("visibility","visible");
	});
   $(".minOption").click(function(){
	$("#dir").html("Results:");
	movie.theMinRating=$(this).attr('id');
	$("#minRating").css("visibility","hidden");
	$("#results").css("visibility","visible");
	movie.getMovies();
	});
   $("#reset").click(function(){
		$("#reset").css("visibility","hidden");
		$("#ageRating").css("visibility","hidden");
		$("#minRating").css("visibility","hidden");
		$("#movies").empty();
		$("#movies").css("visibility","hidden");
		$("#genre").css("visibility","visible");
		$("#dir").html("Select Genre:");
		$("#results").empty();
		$("#results").css("visibility","hidden");
	});
};

movie.getGenres=function(){
$.ajax({
            url : "http://rosemary.umw.edu/~jwhite3/moviegenie/proxy.php?url=" +
                escape("http://api.themoviedb.org/2.1/Genres.getList/en/json/"+
		"a8ddc3ac74e356b14634f3327af5e974"),
            type : "GET",
            dataType : "json"
        }).done(movie.saveGenres);
};

movie.saveGenres=function(data){
	for(var i=1; i<data.length; i++){
		var genreName=data[i].name;
		var id=data[i].id;
		movie.genres[genreName]=id;
	}
//alert(JSON.stringify(movie.genres));
//alert(movie.genres["Action"]);
	movie.loadConsole();
};

movie.getMovies=function(){
$.ajax({
            url : "http://rosemary.umw.edu/~jwhite3/moviegenie/proxy.php?url=" +
               escape("http://api.themoviedb.org/2.1/Movie.browse/en-US/json/"+
                "a8ddc3ac74e356b14634f3327af5e974?genres="+movie.theGenre+
		"&certifications="+movie.theAgeRating+"&rating_min="+
		movie.theMinRating+"&rating_max=10&order_by=rating"+
		"&min_votes=20"),
            type : "GET",
            dataType : "json"
        }).done(movie.showMovies);
};

movie.showMovies=function(data){
$("#results").empty();
//alert(JSON.stringify(data));
if(data[0]==="Nothing found."){
$("#genie").append("<div id=\"results\"></div>");
$("#results").append("No results found.");
return;
}
	for(var i=0; i<6; i++){
		if(!data[i]){break;}
		var title = data[i].name;
		var displayTitle = title;
		if(displayTitle.length>24){
			displayTitle=displayTitle.substring(0,20)+"...";
		}	
		var release = data[i].released;
		var rating = data[i].rating;
		var id = data[i].id;
	$("#results").append("<div class=\"movieOption "+
        "result\" id=\""+id+"\">"+displayTitle+"</div>");
	}
	$(".result").click(function(){
		//alert(this.innerHTML);
		movie.searchTitle=this.innerHTML;
		$.ajax({
            		url : "http://rosemary.umw.edu/~jwhite3/moviegenie/"+
			"proxy.php?url=" +
               		escape("http://api.rottentomatoes.com/api/public/v1.0/"+
                	"movies.json?apikey=dkje9qpd5tt9nfhncw46z2zw&q="+
                	escape(movie.searchTitle)),
            		type : "GET",
            		dataType : "json"
        	}).done(movie.showMovieInfo);

	});

};

movie.showMovieInfo=function(data){
//alert(JSON.stringify(data));
//alert(JSON.stringify(data.movies[0]));
var movieResults=data.movies;
$("#movies").css("visibility","visible");
$("#movies").empty();
var movieToGet=-1;
for(var x=0; x<movieResults.length; x++){
	if(movieResults[x].title===movie.searchTitle){
		movieToGet=x;
		break;
	}else if(movieResults[x].title.substring(0,20)+
	"..."===movie.searchTitle){
		movieToGet=x;
		break;
	}
}
if(movieToGet===-1){
movieToGet=0;
}
	$.ajax({
		url : "http://rosemary.umw.edu/~jwhite3/moviegenie/"+
		"proxy.php?url=" +
		escape("http://api.rottentomatoes.com/api/public/v1.0/"+
                "movies/"+movieResults[movieToGet].id+
		".json?apikey=dkje9qpd5tt9nfhncw46z2zw&q"),
                type : "GET",
                dataType : "json"
        }).done(movie.displayMovieInfo);

};

movie.displayMovieInfo=function(data){
//	alert(JSON.stringify(data));
	//$("#movies").empty();
	$("#movies").append("<img src=\""+data.posters.thumbnail+
	"\"/><h2>"+data.title+"</h2></br>");
	$("#movies").append("<b>Critics say:</b> \""+
	data.critics_consensus+"\"</br>");
	$("#movies").append("<b>Rotten Tomatoes Rating:</b> "+
	data.ratings.critics_score+"% ("+data.ratings.critics_rating+")</br>");
	$.ajax({
                url : "http://rosemary.umw.edu/~jwhite3/moviegenie/"+
                "proxy.php?url=" +
                escape("https://www.googleapis.com/shopping/search/"+
		"v1/public/products?key=AIzaSyAviqSIo2StUke8Wqj7eBs"+
		"I7gy5mfkPfmo&country=US&q="+escape(data.title)+
		"dvd&rankBy=relevancy"),
                type : "GET",
                dataType : "json"
        }).done(movie.displayShoppingInfo);

};

movie.displayShoppingInfo=function(data){
	$("#movies").append("<a href=\""+data.items[0].product.link+"\""+
	" target=\"_blank\">Click here for shopping results</a></br>");
};


$(document).ready(movie.init);
