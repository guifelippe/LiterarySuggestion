require 'sinatra'
require 'json'
require 'pg' # Driver do PostgreSQL
require 'rack/cors' # Adicione esta linha para carregar o rack-cors

use Rack::Cors do
  allow do
    origins 'http://localhost:3000'
    resource '*', headers: :any, methods: [:get, :post, :options]
  end
end

db = PG.connect(dbname: '<your database>', user: '<your user>', password: '<your password>')

get '/books' do
  content_type :json
  result = db.exec('SELECT * FROM books')
  result.map { |row| row.to_h }.to_json
end

get '/books/:genreId' do
  content_type :json
  genre_id = params[:genreId]
  result = db.exec_params('SELECT * FROM books WHERE "genreId" = $1', [genre_id])
  books = result.map { |row| row.to_h }
  books.to_json
end

get '/genre' do 
    content_type :json
    result = db.exec_params('SELECT * FROM genre')
    result.map { |row| row.to_h }.to_json
end

post '/genre-create' do
    genre_data = JSON.parse(request.body.read)
    
    if genre_data.key?('name')
      name = genre_data['name']
      
      result = db.exec_params('INSERT INTO genre (name) VALUES ($1) RETURNING *', [name])
      
      result.first.to_h.to_json
    else
      status 400
      body 'The "name" field is mandatory.'
    end
end

post '/books-create' do
  book_data = JSON.parse(request.body.read)
  
  if book_data.key?('title') && book_data.key?('image') && book_data.key?('summary') && book_data.key?('genreId')
      title = book_data['title']
      image = book_data['image']
      summary = book_data['summary']
      genre_id = book_data['genreId']
    
      result = db.exec_params('INSERT INTO books (title, image, summary, "genreId") VALUES ($1, $2, $3, $4) RETURNING *', [title, image, summary, genre_id])
    
      result.first.to_h.to_json
  else
      status 400
      body 'Os campos "title", "image", "summary" e "genreId" são obrigatórios.'
  end
end