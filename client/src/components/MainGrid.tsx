'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Item } from '../types/item';

interface Column {
    key: string;
    label: string;
}

interface MainGridProps {
    title: string;
    columns: Column[];
    items: Item[];
    itemNoun: string;
    onAddItem: () => void;
    onEditItem: (item: Item) => void;
    onDeleteItems: (selectedIds: (string | number)[]) => void;
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (newPage: number) => void;
}

const renderCellContent = (value: unknown) => {
    if (typeof value === 'boolean') {
        return value ? (
            <span className="status-badge text-success">
                <i className="bi bi-check-circle-fill"></i> Activo
            </span>
        ) : (
            <span className="status-badge text-danger">
                <i className="bi bi-x-circle-fill"></i> Inactivo
            </span>
        );
    }
    return String(value ?? '');
};

export default function MainGrid({ title, columns, items, itemNoun, onAddItem, onEditItem, onDeleteItems, totalItems, itemsPerPage, currentPage, onPageChange }: MainGridProps) {
    const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allItemIds = items.map(item => item.id);
            setSelectedItems(allItemIds);
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: string | number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await onDeleteItems(selectedItems);

            setSelectedItems([]);

        } catch (error) {
            console.error("Deletion failed, selection not cleared.", error);
        }
    };

    const isAllSelected = items.length > 0 && selectedItems.length === items.length;
    const firstItem = (currentPage - 1) * itemsPerPage + 1;
    const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-6">
                                <h2><b>{title}</b></h2>
                            </div>
                            <div className="col-sm-6">
                                <Button onClick={() => onAddItem()} className="btn btn-success">
                                    <i className="material-icons">&#xE147;</i> <span>Añadir {itemNoun}</span>
                                </Button>
                                <Button onClick={handleConfirmDelete} className="btn btn-danger" disabled={selectedItems.length === 0}>
                                    <i className="material-icons">&#xE15C;</i> <span>Eliminar</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>
                                    <span className="custom-checkbox">
                                        <input type="checkbox" id="selectAll" checked={isAllSelected} onChange={handleSelectAll} aria-label="Select all rows" />
                                        <label htmlFor="selectAll"></label>
                                    </span>
                                </th>
                                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <span className="custom-checkbox">
                                            <input
                                                type="checkbox"
                                                id={`checkbox${item.id}`}
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                                aria-label={`Select row for item ${item.id}`}
                                            />
                                            <label htmlFor={`checkbox${item.id}`}></label>
                                        </span>
                                    </td>
                                    {columns.map(col => (
                                        <td key={`${item.id}-${col.key}`}>
                                            {renderCellContent(item[col.key])}
                                        </td>
                                    ))}
                                    <td>
                                        <a href="#edit" className="edit" onClick={(e) => { e.preventDefault(); onEditItem(item); }}>
                                            <i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
                                        </a>
                                        <a href="#delete" className="delete" onClick={(e) => { e.preventDefault(); onDeleteItems([item.id]); }}>
                                            <i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="clearfix">
                        <div className="hint-text">
                            Mostrando <b>{firstItem}-{lastItem}</b> de <b>{totalItems}</b> registros
                        </div>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <a href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) onPageChange(currentPage - 1); }} className="page-link">Anterior</a>
                            </li>
                            {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => i + 1).map(pageNumber => (
                                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onPageChange(pageNumber); }} className="page-link">{pageNumber}</a>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === Math.ceil(totalItems / itemsPerPage) ? 'disabled' : ''}`}>
                                <a href="#" onClick={(e) => { e.preventDefault(); if (currentPage < Math.ceil(totalItems / itemsPerPage)) onPageChange(currentPage + 1); }} className="page-link">Siguiente</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add {itemNoun}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Add form...
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button variant="primary">Add</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {itemNoun}(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete these {selectedItems.length} records? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger">Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
