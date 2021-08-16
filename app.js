class Book {
    constructor(name,author) {
        this.name = name;
        this.author = author;
    }

}

class BookService {
    // when you exceed max number of requests for free acct, you have to get a new one.
    // To get a new one, you have to delete the crudcrud cookie that records your current acct.
    static crudCrudAcct = "dd39031e0b5c4288929d30ec9259aca7";
    static url = "https://crudcrud.com/api/"+ this.crudCrudAcct +"/books";

    // create
    static create(BookIn){
        console.log(">> create: " + this.url);
        return $.post(this.url, BookIn );
    /*
        var btn = document.getElementById("create-unicorn-button");
        var xhr = new XMLHttpRequest();
        xhr.onloadstart = function () { btn.classList.toggle('is-loading'); };
        xhr.onload = function () { btn.classList.toggle('is-loading'); };
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(jsonString);
    */
    }
    // read
    static getAll(){
        console.log(">> getAll: " + this.url);
        return $.get(this.url);
    }
    static getById(id){
        console.log(">> getById: " + this.url);
        return $.get(this.url + `/${id}`);
    }

    //update
    static update(BookIn){
        return $.ajax({
            url: this.url + `/${BookIn._id}`,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(BookIn),
            contentType: "application/json",
            type: "PUT"
        });
    }

    //delete
    static delete(id){
        console.log("delete: " + this.url + `/${id}`);
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}

class DOMManager {
    static Books;
    static dataForm = document.dataForm;

    static getBooks(){
        BookService.getAll().then( (Books) => this.render(Books) );
    }
    // delete
    static deleteItem(){
        console.log("delete item " + this.dataForm.id.value);
        let strErr = ""; 

        let daForm = this.dataForm;
        let thisId = daForm.id.value.trim();
        if(thisId.length === 0 ) strErr += ", ID is required";

        if (strErr.length > 0) {
            console.log("Errors: " +  strErr.substring(2,strErr.length));
        } else {
            BookService.delete(thisId)
                .then( () => { return BookService.getAll()} )
                .then( (Books) => this.render(Books) );
        }
    }

    static addItem(){
        console.log("add item " + this.dataForm.name.value);

        let daForm = this.dataForm;
        let strErr = ""; 
        if(daForm.name.value.trim().length === 0 ) strErr += ", Name is required";
        if(daForm.author.value.trim().length === 0 ) strErr += ", Author is required";

        if (strErr.length > 0) {
            console.log("Errors: " +  strErr.substring(2,strErr.length));
        } else {
            let NB = new Book( daForm.name.value, daForm.author.value );
            BookService.create( NB )
            .then( () => { return BookService.getBooks()} )
            .then( (Books) => this.render(Books) );
    }

    }

    static updateItem(){
        console.log("update item " + this.dataForm.id.value);
        return;

    }

    static loadItem(idIn){
        let daForm = this.dataForm;
        let Books = this.Books;
        for (let i=0; i<Books.length; i++) {
            if(Books[i]._id === idIn) {
                daForm.name.value = Books[i].name;
                daForm.author.value = Books[i].author;
                daForm.id.value = Books[i]._id;
                break;
            }
        }
    }

    // render - redraw data in the sceen
    static render(Books){
        this.Books = Books;
        console.log(">>Books: " + JSON.stringify(Books));
        //clear
        $('#book-list').empty();   
        //rewrite
        console.log(">> len" + Books.length)
        for (let Book of Books) {
            $('#book-list').prepend(
                `<li><strong>${Book.name}</strong>, <em> by ${Book.author}</em> - <a href="#" onclick="DOMManager.loadItem('${Book._id}')">Select</a>
                </li>`
            );   
        }
    }
}

$('#btnAdd').on('click',() => { DOMManager.addItem() });
$('#btnUpdate').on('click',() => { DOMManager.updateItem() });
$('#btnDelete').on('click',() => { DOMManager.deleteItem() });

DOMManager.getBooks();
