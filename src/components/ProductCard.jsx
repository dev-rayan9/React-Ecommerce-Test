import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const cartIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6.5 17a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM2 2h2.5l2.1 10.39a2 2 0 002 1.61h6.88a2 2 0 001.98-1.75l.7-6.25H5.12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const zoomIcon = (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#2563eb" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
);
const closeIcon = (
  <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#fff"/><path d="M9 9l10 10M19 9l-10 10" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
);

const inStockIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#22c55e"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const outStockIcon = (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#ef4444"/><path d="M7 7l6 6M13 7l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
);

const ProductCard = ({
  image,
  name,
  price,
  variants = [],
  selectedVariant,
  onVariantChange,
  inStock = true,
  onAddToCart,
  disabled = false,
}) => {
  const buttonRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  const handleButtonClick = (e) => {
    if (!inStock || disabled) return;
    const button = buttonRef.current;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    button.appendChild(circle);
    onAddToCart();
  };

  return (
    <>
      <motion.div
        style={styles.card}
        whileHover={{
          boxShadow: "0 12px 36px rgba(14,165,233,0.13)",
          transition: { type: "spring", stiffness: 300, damping: 18 },
        }}
        whileTap={{}}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={styles.flexCol}>
          <div style={styles.imageWrapper}>
            <img src={image} alt={name} style={styles.image} />
            <AnimatePresence>
              {hovered && (
                <motion.button
                  style={styles.zoomBtn}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={e => { e.stopPropagation(); setShowModal(true); }}
                  tabIndex={-1}
                >
                  {zoomIcon}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <div style={styles.body}>
            <h3 style={styles.name} title={name}>{name}</h3>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.priceBadge}>
              <span style={styles.priceIcon}>$</span>
              <span style={styles.priceText}>{price}</span>
            </div>
            {inStock ? (
              <span style={styles.stockIn}><span style={styles.stockIcon}>{inStockIcon}</span> <span style={styles.stockText}>In Stock</span></span>
            ) : (
              <span style={styles.stockOut}><span style={styles.stockIcon}>{outStockIcon}</span> <span style={styles.stockText}>Out of Stock</span></span>
            )}
          </div>
          {variants.length > 0 && (
            <select
              style={styles.select}
              value={selectedVariant}
              onChange={onVariantChange}
              disabled={!inStock || disabled}
            >
              {variants.map((variant) => (
                <option key={variant} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
          )}
          <div style={styles.buttonRow}>
            <motion.button
              ref={buttonRef}
              style={{
                ...styles.button,
                ...(inStock && !disabled ? {} : styles.buttonDisabled),
              }}
              whileHover={inStock && !disabled ? { scale: 1.03, background: "#0369a1" } : {}}
              whileTap={inStock && !disabled ? { scale: 0.98 } : {}}
              onClick={handleButtonClick}
              disabled={!inStock || disabled}
            >
              <motion.span
                style={styles.cartIcon}
                whileHover={{ x: 4, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                {cartIcon}
              </motion.span>
              <span style={{ marginLeft: 8 }}>Add to Cart</span>
            </motion.button>
          </div>
        </div>
        <style>{`
          .ripple {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            background: rgba(255,255,255,0.5);
            pointer-events: none;
          }
          @keyframes ripple {
            to {
              transform: scale(2.5);
              opacity: 0;
            }
          }
          button { position: relative; overflow: hidden; font-family: 'Poppins', sans-serif; }
        `}</style>
      </motion.div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              style={styles.modalContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
            >
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>{closeIcon}</button>
              <img src={image} alt={name} style={styles.modalImage} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const styles = {
  card: {
    background: "#fff",
    borderRadius: "1.25rem",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    padding: "2rem 1.5rem 1.7rem 1.5rem",
    minWidth: 0,
    maxWidth: 370,
    width: "100%",
    margin: "auto",
    minHeight: 480,
    height: "100%",
    transition: "box-shadow 0.2s, transform 0.2s",
    fontFamily: "'Poppins', sans-serif",
  },
  flexCol: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1.2rem",
    minHeight: 200,
    maxHeight: 200,
    background: "#fff",
    borderRadius: "1rem",
    overflow: "hidden",
    border: "1.5px solid #f1f5f9",
    position: "relative",
  },
  image: {
    maxWidth: 180,
    maxHeight: 180,
    width: "auto",
    height: 180,
    objectFit: "contain",
    borderRadius: "0.7rem",
    transition: "transform 0.2s",
    margin: "0 auto",
    display: "block",
    background: "#fff",
  },
  zoomBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "#fff",
    border: "1.5px solid #e0e7ef",
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    padding: 7,
    cursor: "pointer",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
  },
  body: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
    marginBottom: 0,
    fontFamily: "'Poppins', sans-serif",
  },
  name: {
    fontSize: "19px",
    fontWeight: 400,
    margin: "0 0 0.7rem 0",
    textAlign: "left",
    color: "rgb(56 57 60)",
    minHeight: 48,
    lineHeight: 1.3,
    flex: 0,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxHeight: "2.6em",
    fontFamily: "'Poppins', sans-serif",
  },
  priceBadge: {
    display: "flex",
    alignItems: "center",
    background: "#f0f6ff",
    color: "#2563eb",
    borderRadius: "0.6rem",
    padding: "3px 14px",
    fontWeight: 500,
    fontSize: "10px",
    boxShadow: "0 1px 4px rgba(37,99,235,0.04)",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: "0.01em",
    border: "1.5px solid #e0e7ef",
    flex: 1,
    minWidth: 0,
    marginRight: 12,
    justifyContent: "flex-start",
  },
  priceIcon: {
    fontWeight: 600,
    fontSize: "1.1rem",
    marginRight: 3,
    color: "#2563eb",
    fontFamily: "'Poppins', sans-serif",
  },
  priceText: {
    fontWeight: 500,
    fontSize: "1.13rem",
    fontFamily: "'Poppins', sans-serif",
  },
  select: {
    width: "100%",
    padding: "0.6rem",
    borderRadius: "0.6rem",
    border: "1.5px solid #e5e7eb",
    marginBottom: "1.2rem",
    fontSize: "1rem",
    background: "#f9fafb",
    color: "#222",
    outline: "none",
    transition: "border 0.2s",
    textAlign: "left",
    fontFamily: "'Poppins', sans-serif",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    margin: "1.2rem 0 0.7rem 0",
    gap: 8,
    minHeight: 32,
    fontFamily: "'Poppins', sans-serif",
  },
  stockRow: {
    display: "none",
  },
  stockIn: {
    display: "flex",
    alignItems: "center",
    color: "#22c55e",
    fontWeight: 600,
    fontSize: 15,
    gap: 6,
    border: "1.5px solid #d1fae5",
    background: "#f0fdf4",
    borderRadius: "0.7rem",
    padding: "5px 0.85em 5px 0.7em",
    transition: "border 0.2s, background 0.2s",
    fontFamily: "'Poppins', sans-serif",
    whiteSpace: "nowrap",
  },
  stockOut: {
    display: "flex",
    alignItems: "center",
    color: "#ef4444",
    fontWeight: 600,
    fontSize: 15,
    gap: 6,
    border: "1.5px solid #fee2e2",
    background: "#fef2f2",
    borderRadius: "0.7rem",
    padding: "6px 0.75rem 6px 0.5rem",
    transition: "border 0.2s, background 0.2s",
    fontFamily: "'Poppins', sans-serif",
    whiteSpace: "nowrap",
  },
  stockText: {
    marginLeft: 6,
    fontSize: 15,
    fontFamily: "'Poppins', sans-serif",
  },
  stockIcon: {
    display: "inline-flex",
    alignItems: "center",
    marginRight: 2,
  },
  buttonRow: {
    display: "flex",
    alignItems: "flex-end",
    width: "100%",
  },
  button: {
    width: "100%",
    padding: "0.85rem 0",
    borderRadius: "0.6rem",
    border: "none",
    background: "#0ea5e9",
    color: "#fff",
    fontWeight: 400,
    fontSize: "1.08rem",
    cursor: "pointer",
    transition: "background 0.2s, opacity 0.2s, transform 0.2s",
    marginTop: "0.5rem",
    boxShadow: "0 1px 6px rgba(14,165,233,0.07)",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  buttonDisabled: {
    background: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  cartIcon: {
    display: "inline-flex",
    alignItems: "center",
    marginRight: 4,
    verticalAlign: "middle",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(30,41,59,0.18)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(2px)",
  },
  modalContent: {
    position: "relative",
    background: "#fff",
    borderRadius: "1.2rem",
    boxShadow: "0 8px 40px rgba(30,41,59,0.18)",
    padding: "2.5rem 2.5rem 2rem 2.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 650,
    width: "92vw",
    aspectRatio: '4/3',
    minHeight: 320,
    maxHeight: '80vh',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: '1rem',
    background: '#fff',
    display: 'block',
    margin: '0 auto',
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "#fff",
    border: "none",
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    padding: 4,
    cursor: "pointer",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
  },
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  variants: PropTypes.array,
  selectedVariant: PropTypes.string,
  onVariantChange: PropTypes.func,
  inStock: PropTypes.bool,
  onAddToCart: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ProductCard; 