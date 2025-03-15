window.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("bookFormIsComplete");
  const bookForm = document.getElementById("bookForm");
  const completeBookList = document.getElementById("completeBookList");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const searchForm = document.getElementById("searchBook");
  const inputFields = document.querySelectorAll('input');

  loadBook("booksList");

  
  inputFields.forEach(input => {
    const label = document.querySelector(`label[for="${input.id}"]`); // Ambil label yang sesuai
  
    input.addEventListener('focus', function() {
      input.style.border = "3px solid #007bff";
      input.style.outline = "none"; // Hilangkan outline bawaan browser
  
      if (label) {
        label.style.color = "#007bff"; // Ubah warna label saat input fokus
      }
    });
  
    input.addEventListener('blur', function() {
      input.style.border = "1px solid black"; // Kembalikan border ke normal
  
      if (label) {
        label.style.color = "black"; // Kembalikan warna label ke semula
      }
    });
  });
  


  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const bookTitle = document.getElementById("bookFormTitle").value;
    const bookAuthor = document.getElementById("bookFormAuthor").value;
    const bookYear = Number(document.getElementById("bookFormYear").value);
    const isComplete = checkbox.checked;

    const newBook = {
      id: generateId(),
      title: bookTitle,
      author: bookAuthor,
      year: bookYear,
      isComplete: isComplete,
    };
    console.log(newBook);
    saveBook(newBook);

    renderBooks();
    event.target.reset();
  });

  // Mengubah label checkbox saat dipilih
  checkbox.addEventListener("change", function () {
    const textAdd = document.getElementById("belumSelesaiDibaca");
    textAdd.innerText = this.checked
      ? "Selesai Dibaca"
      : "Belum Selesai Dibaca";
  });

  [completeBookList, incompleteBookList].forEach((list) => {
    list.addEventListener("click", function (event) {
      if (event.target.tagName !== "BUTTON") return null;
      else {
        const bookId = getId(event);
        const buttonType = event.target.getAttribute("data-testid");
        console.log(buttonType);

        if (buttonType === "bookItemIsCompleteButton") {
          isComplete(bookId);
          return renderBooks();
        } else if (buttonType === "bookItemDeleteButton") {
          if (confirm(`kamu yakin ingin menghapus?`)) {
            removeBook(bookId);
          }
          return renderBooks();
        } else if (buttonType === "bookItemEditButton") {
          const editForm = document.getElementById("editForm");
          const closeBtn = document.querySelector(".close");

          const book = getBookById(bookId);
          const bookTitleInput = document.getElementById("editBookTitle");
          const bookAuthorInput = document.getElementById("editBookAuthor");
          const bookYearInput = document.getElementById("editBookYear");

          bookTitleInput.value = book.title;
          bookAuthorInput.value = book.author;
          bookYearInput.value = book.year;

          editForm.style.visibility = "visible";
          closeBtn.removeEventListener("click", closeModal);
          closeBtn.addEventListener("click", closeModal);

          function closeModal() {
            editForm.style.visibility = "hidden";
            renderBooks();
          }

          editForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const editedBook = {
              id: bookId,
              title: bookTitleInput.value,
              author: bookAuthorInput.value,
              year: Number(bookYearInput.value),
              isComplete: book.isComplete,
            };

            updateBook(editedBook);
            editForm.style.visibility = "hidden";
            renderBooks();
          });
        }
      }
    });
  });

  document.addEventListener("render-books", () => {
    const books = JSON.parse(localStorage.getItem("booksList")) || []; // Ambil daftar buku dari localStorage
    if (books.length === 0) {
      alert("Book list is empty");
    }
    renderUI(books);
});

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchBook = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const books = JSON.parse(localStorage.getItem("booksList")).filter((book) =>
      book.title.toLowerCase().includes(searchBook)
    );

    console.log(books);
    renderUI(books);
  });
});

function generateId() {
  const timestamp = Date.now().toString();
  return timestamp.slice(-8); // Menghasilkan ID dengan mengambil 8 digit terakhir dari timestamp
}

function bookDisplay(book) {
  return `<div class="book" data-bookid="${book.id}" data-testid="bookItem">
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">${
        book.isComplete ? `Belum selesai dibaca` : `Selesai dibaca`
      }</button>
      <button data-testid="bookItemDeleteButton"><span class="delete-symbol">Hapus</span></button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div></div>`;
}

function loadBook(storage) {
  if (!localStorage.getItem(storage)) {
    localStorage.setItem(storage, JSON.stringify([]));
  } else {
    const books = JSON.parse(localStorage.getItem(storage)); // Ambil daftar buku dari localStorage
    renderUI(books);
  }
}

function renderBooks() {
  document.dispatchEvent(new Event("render-books"));
}

function saveBook(book) {
  const books = JSON.parse(localStorage.getItem("booksList")) || [];
  books.push(book);
  localStorage.setItem("booksList", JSON.stringify(books));
}

function getId(event) {
  let bookElement = event.target.closest(".book");
  const bookId = bookElement.getAttribute("data-bookid");
  return bookId;
}
function isComplete(id) {
  const books = JSON.parse(localStorage.getItem("booksList"));

  const updatedBooks = books.map((book) => {
    if (book.id === id) {
      return { ...book, isComplete: !book.isComplete };
    }
    return book;
  });
  localStorage.setItem("booksList", JSON.stringify(updatedBooks));
}

function removeBook(id) {
  if (!localStorage.getItem("booksList")) {
    localStorage.setItem("booksList", JSON.stringify([]));
  } else {
    const books = JSON.parse(localStorage.getItem("booksList"));
    const updatedBooks = books.filter((book) => book.id != id);
    localStorage.setItem("booksList", JSON.stringify(updatedBooks));
  }
}

function renderUI(books) {
  completeBookList.innerHTML = "";
  incompleteBookList.innerHTML = "";
  books.forEach((book) => {
    const bookHtml = bookDisplay(book); // Buat HTML untuk buku
    book.isComplete
      ? (completeBookList.innerHTML += bookHtml)
      : (incompleteBookList.innerHTML += bookHtml);
  });
}
function getBookById(bookId) {
  const books = JSON.parse(localStorage.getItem("booksList")) || [];
  return books.find((book) => book.id === bookId);
}

function updateBook(updatedBook) {
  let books = JSON.parse(localStorage.getItem("booksList")) || [];
  books = books.map((book) =>
    book.id === updatedBook.id ? updatedBook : book
  );
  localStorage.setItem("booksList", JSON.stringify(books));
}
