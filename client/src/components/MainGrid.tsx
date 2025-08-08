'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from '@/styles/MainGrid.module.css';
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
    console.log("Valor: ", value);
    if (typeof value === 'number') {
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

const isEstatusLabel = (label?: string) => !!label && /estatus/i.test(label);

const getCellValueAsString = (value: unknown): string => {
    if (typeof value === 'boolean') {
        return value ? 'Activo' : 'Inactivo';
    }
    return String(value ?? '');
};


export default function MainGrid({ title, columns, items, itemNoun, onAddItem, onEditItem, onDeleteItems, itemsPerPage, currentPage, onPageChange }: MainGridProps) {
    const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filterText, setFilterText] = useState('');

    const filteredItems = items.filter(item => {
        return Object.values(item).some(value =>
            getCellValueAsString(value).toLowerCase().includes(filterText.toLowerCase())
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

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

    const isAllSelected = paginatedItems.length > 0 && selectedItems.length === paginatedItems.length;
    const firstItem = (currentPage - 1) * itemsPerPage + 1;
    const lastItem = Math.min(currentPage * itemsPerPage, filteredItems.length);

    return (
        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row align-items-center">

                            <div className="col">
                                <h2><b>{title}</b></h2>
                            </div>

                            <div className="col-auto">
                                <Button onClick={onAddItem} className="btn btn-success me-2 d-inline-flex align-items-center">
                                    <i className="material-icons">&#xE147;</i> <span>Añadir {itemNoun}</span>
                                </Button>
                                <Button onClick={() => handleConfirmDelete()} className="btn btn-danger d-inline-flex align-items-center" disabled={selectedItems.length === 0}>
                                    <i className="material-icons">&#xE15C;</i> <span>Eliminar</span>
                                </Button>
                            </div>

                            <div className={`col-auto ${styles.searchBar}`}>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`Buscar ${itemNoun}...`}
                                        value={filterText}
                                        onChange={(e) => setFilterText(e.target.value)}
                                    />
                                </div>
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
                            {paginatedItems.map((item) => (
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
                                    {columns.map((col, idx) => {
                                        const val = (item as Item)[col.key];
                                        const isLast = idx === columns.length - 1;
                                        const shouldUseRenderer =
                                            isEstatusLabel(col.label) || (isLast && typeof val === 'number');

                                        return (
                                            <td key={`${item.id}-${col.key}`}>
                                                {shouldUseRenderer ? renderCellContent(val) : String(val ?? '')}
                                            </td>
                                        );
                                    })}
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
                            Mostrando <b>{paginatedItems.length > 0 ? firstItem : 0}-{lastItem}</b> de <b>{filteredItems.length}</b> registros
                        </div>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <a href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) onPageChange(currentPage - 1); }} className="page-link">Anterior</a>
                            </li>
                            {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => i + 1).map(pageNumber => (
                                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); onPageChange(pageNumber); }} className="page-link">{pageNumber}</a>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === Math.ceil(filteredItems.length / itemsPerPage) ? 'disabled' : ''}`}>
                                <a href="#" onClick={(e) => { e.preventDefault(); if (currentPage < Math.ceil(filteredItems.length / itemsPerPage)) onPageChange(currentPage + 1); }} className="page-link">Siguiente</a>
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
