const { nanoid } = require('nanoid');
const books = require('./books');

// Kriteria 1 : API dapat menyimpan buku

const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    // Client tidak melampirkan properti namepada request body.
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
    }

    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    let finished;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // Nilai finished
    if (pageCount === readPage) {
        finished = true;
    } else {
        finished = false;
    }

    const newBooks = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBooks);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

// Kriteria 2 : API dapat menampilkan seluruh buku

const getAllBooksHandler = (request, h) => {
    // query parameters ?name
    const { name } = request.query;
    if (name !== undefined) {
        return {
          status: 'success',
          data: {
            books: books.filter((book) => book.name
                .toLowerCase().includes(name.toLowerCase())).map((na) => ({
                id: na.id,
                name: na.name,
                publisher: na.publisher,
            })),
        },
        };
    }

    // query parameters ?reading=1
    const { reading } = request.query;
    if (reading === '1') {
        return {
            status: 'success',
            data: {
                books: books.filter((book) => book.reading === true).map((re) => ({
                    id: re.id,
                    name: re.name,
                    publisher: re.publisher,
                })),
            },
        };
    }

    // query parameters ?reading=0
    if (reading === '0') {
        return {
            status: 'success',
            data: {
                books: books.filter((book) => book.reading === false).map((re) => ({
                    id: re.id,
                    name: re.name,
                    publisher: re.publisher,
                })),
            },
        };
    }

    // query parameters ?finished=1
    const { finished } = request.query;
    if (finished === '1') {
        return {
            status: 'success',
            data: {
                books: books.filter((book) => book.finished === true).map((fi) => ({
                    id: fi.id,
                    name: fi.name,
                    publisher: fi.publisher,
                })),
            },
        };
    }

    // query parameters ?finished=0
    if (finished === '0') {
        return {
            status: 'success',
            data: {
                books: books.filter((book) => book.finished === false).map((fi) => ({
                    id: fi.id,
                    name: fi.name,
                    publisher: fi.publisher,
                })),
            },
        };
    }

    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

// Kriteria 3 : API dapat menampilkan detail buku

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

   if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Kriteria 4 : API dapat mengubah data buku
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        } = request.payload;

    // Client tidak melampirkan properti namepada request body.
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
    }

    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Kriteria 5 : API dapat menghapus buku
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }

   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
