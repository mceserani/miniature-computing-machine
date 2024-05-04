import { useState, useEffect } from 'react'
import './App.css'

function FilterableProductTable() {

  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [prodotti, setProdotti] = useState([]);
  
  useEffect(() => {
    const fetchData = () => {
      fetch("http://172.18.2.165:3000/list")
        .then(response => response.json())
        .then(data => setProdotti(data))
        .catch(error => console.error('Error fetching data: ', error));
    };

    fetchData();  // Esegui immediatamente la prima volta

    const intervalId = setInterval(fetchData, 5000);  // Aggiorna i dati ogni 5 secondi

    return () => clearInterval(intervalId);  // Pulizia: rimuove l'intervallo quando il componente viene smontato
  }, []);  // Le parentesi quadre vuote indicano che questo effetto non ha dipendenze e viene eseguito solo al montaggio

  return (
    <div class="FilterableProductTable">
      <SearchBar 
        filterText={ filterText }
        inStockOnly={ inStockOnly }
        setInStockOnly= { setInStockOnly }
        setFilterText={ setFilterText }/>
      <ProductTable 
        prodotti={ prodotti } 
        filterText={ filterText }
        inStockOnly={ inStockOnly }/>
    </div>
  )
}

function SearchBar({ filterText, inStockOnly, setInStockOnly, setFilterText }) {
  return (
    <div class="SearchBar">
      <input type="text" id="search" placeholder="Search..."  value={ filterText } onChange={ search => setFilterText(search.target.value)}/>
      <label>
        <input type="checkbox" id="instock" checked={ inStockOnly } onChange={ instock => setInStockOnly(instock.target.checked) }/>
        Only show products in stock
      </label>
    </div>
  )
}

function ProductRow({ nome, prezzo, stock }) {

  if (stock === false) {
    nome = <span class="out_of_stock">{ nome }</span>
  }

  return (
    <div class="ProductRow">
      <span class="Name">{ nome }</span>
      <span class="Price">{ prezzo }</span>
    </div>
  )
}

function ProductCategoryRow({ categoria }) {
  return (
    <div class="ProductCategoryRow">
      { categoria }
    </div>
  )
} 

function ProductTable({ prodotti, filterText, inStockOnly }) {
  let righe = [];

  if (inStockOnly) {
    prodotti = prodotti.filter(p => p.stocked === true);
  }

  if (filterText !== '') {
    prodotti = prodotti.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));
  }

  righe.push(<ProductCategoryRow categoria="Fruits" />);
  let fruits = prodotti.filter(p => p.category === "Fruits");
  fruits.forEach(p => righe.push(<ProductRow nome={p.name} prezzo={p.price} stock={p.stocked} />));

  righe.push(<ProductCategoryRow categoria="Vegetables" />);
  let vegetables = prodotti.filter(p => p.category === "Vegetables");
  vegetables.forEach(p => righe.push(<ProductRow nome={p.name} prezzo={p.price} stock={p.stocked} />));

  return (
    <div class="ProductTable">
      <div class="ProductTableHeader">
        <span class="Name_h">Nome</span>
        <span class="Price_h">Prezzo</span>
      </div>
      { righe }
    </div>
  )
}

export default  FilterableProductTable;