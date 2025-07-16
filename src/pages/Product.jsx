import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
      const response2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const data2 = await response2.json();
      setSimilarProducts(data2);
      setLoading2(false);
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    const inStock = product.stock !== undefined
      ? product.stock > 0
      : (product.rating?.count > 0 && product.id % 3 !== 0);
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <img
                className="img-fluid"
                src={product.image}
                alt={product.title}
                width="400px"
                height="400px"
              />
            </div>
            <div className="col-md-6 col-md-6 py-5">
              <h4 className="text-uppercase text-muted">{product.category}</h4>
              <h1 className="display-5">{product.title}</h1>
              <p className="lead">
                {product.rating && product.rating.rate}{" "}
                <i className="fa fa-star"></i>
              </p>
              <h3 className="display-6  my-4">${product.price}</h3>
              <p className="lead">{product.description}</p>
              <div style={{ marginBottom: '1rem' }}>
                {inStock ? (
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>In Stock</span>
                ) : (
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>Out of Stock</span>
                )}
              </div>
              <button
                className="btn btn-outline-dark"
                onClick={() => addProduct(product)}
                disabled={!inStock}
                style={!inStock ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
              >
                Add to Cart
              </button>
              <Link to="/cart" className="btn btn-dark mx-3">
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4" style={{ padding: 0, margin: 0 }}>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-start', alignItems: 'stretch', flexWrap: 'nowrap', padding: 0, margin: 0 }}>
            {similarProducts.map((item) => {
              const inStock = item.stock !== undefined
                ? item.stock > 0
                : (item.rating?.count > 0 && item.id % 3 !== 0);
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '1.2rem',
                    boxShadow: '0 2px 12px rgba(37,99,235,0.07)',
                    minWidth: 390,
                    maxWidth: 390,
                    // flex: '0 0 180px',
                    margin: 0,
                    padding: '1.2rem 1rem 1.2rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,99,235,0.13)';
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(37,99,235,0.07)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <img
                    className="card-img-top p-2"
                    src={item.image}
                    alt="Card"
                    height={160}
                    width={160}
                    style={{ objectFit: 'contain', borderRadius: '0.7rem', marginBottom: '0.7rem', background: '#f8fafc' }}
                  />
                  <div style={{ width: '100%', textAlign: 'center', marginBottom: 8 }}>
                    <h5 style={{ fontSize: '1.08rem', fontWeight: 600, margin: 0, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title.length > 22 ? item.title.substring(0, 20) + '...' : item.title}
                    </h5>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    {inStock ? (
                      <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '0.98rem' }}>In Stock</span>
                    ) : (
                      <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.98rem' }}>Out of Stock</span>
                    )}
                  </div>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      className="btn"
                      onClick={() => inStock && addProduct(item)}
                      disabled={!inStock}
                      style={{
                        background: inStock ? '#2563eb' : '#e5e7eb',
                        color: inStock ? '#fff' : '#b6c3d1',
                        border: 'none',
                        borderRadius: '0.6rem',
                        fontWeight: 600,
                        fontSize: '1rem',
                        padding: '0.5rem 0',
                        width: '100%',
                        cursor: inStock ? 'pointer' : 'not-allowed',
                        boxShadow: inStock ? '0 1px 4px rgba(37,99,235,0.08)' : 'none',
                        transition: 'all 0.18s',
                        marginBottom: 0,
                      }}
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={"/product/" + item.id}
                      className="btn"
                      style={{
                        background: '#fff',
                        color: '#2563eb',
                        border: '1.5px solid #2563eb',
                        borderRadius: '0.6rem',
                        fontWeight: 600,
                        fontSize: '1rem',
                        padding: '0.5rem 0',
                        width: '100%',
                        textDecoration: 'none',
                        transition: 'all 0.18s',
                      }}
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
          <h2 className="">You may also Like</h2>
            <Marquee
              pauseOnHover={true}
              pauseOnClick={true}
              speed={50}
            >
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
