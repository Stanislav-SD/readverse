"use client";
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FaTrophy, FaTrash, FaSave, FaSync, FaEdit } from "react-icons/fa";

interface Badge {
    Id: number;
    Image: string;
    Label: string;
    Quest: string;
    Conditions: any;
}

interface BadgesData {
    getBadges: Badge[];
}

const GET_BADGES = gql`
    query GetBadges {
        getBadges { Id Image Label Quest Conditions }
    }
`;

const ADD_BADGE = gql`
    mutation AddBadge($Image: String!, $Label: String!, $Quest: String!, $Conditions: JSON!) {
        addBadge(Image: $Image, Label: $Label, Quest: $Quest, Conditions: $Conditions)
    }
`;

const UPDATE_BADGE = gql`
    mutation UpdateBadge($id: Int!, $image: String, $label: String, $quest: String, $conditions: JSON) {
        updateBadge(Id: $id, Image: $image, Label: $label, Quest: $quest, Conditions: $conditions)
    }
`;

const REMOVE_BADGE = gql`
    mutation RemoveBadge($id: Int!) {
        removeBadge(Id: $id)
    }
`;

export default function AdminBadges() {
    const { data, loading, refetch } = useQuery<BadgesData>(GET_BADGES);
    const [addBadge] = useMutation(ADD_BADGE);
    const [updateBadge] = useMutation(UPDATE_BADGE);
    const [removeBadge] = useMutation(REMOVE_BADGE);

    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState({ 
        label: "", 
        image: "", 
        quest: "", 
        conditions: '{\n  "type": "total_pages",\n  "operation": ">=",\n  "value": 100\n}' 
    });

    const handleEdit = (badge: Badge) => {
        setEditId(badge.Id);
        setForm({
            label: badge.Label,
            image: badge.Image,
            quest: badge.Quest,
            conditions: JSON.stringify(badge.Conditions, null, 2)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsedConditions = JSON.parse(form.conditions);
            if (editId) {
                await updateBadge({
                    variables: {
                        id: editId,
                        label: form.label,
                        image: form.image,
                        quest: form.quest,
                        conditions: parsedConditions
                    }
                });
            } else {
                await addBadge({
                    variables: {
                        Label: form.label,
                        Image: form.image,
                        Quest: form.quest,
                        Conditions: parsedConditions
                    }
                });
            }
            reset();
            refetch();
        } catch (err) {
            alert("Error: Ensure your Conditions JSON is valid.");
        }
    };

    const reset = () => {
        setEditId(null);
        setForm({ label: "", image: "", quest: "", conditions: '{\n  "type": "total_pages",\n  "operation": ">=",\n  "value": 100\n}' });
    };

    if (loading) return <div className="p-10 text-white">Loading Badges...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* EDITOR */}
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 h-fit sticky top-10">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <FaTrophy className="text-yellow-500" />
                    {editId ? "Update Badge" : "Create New Badge"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input placeholder="Badge Name (e.g., Page Turner)" required value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="w-full bg-black p-4 border border-zinc-700 rounded-xl focus:border-yellow-500 outline-none"/>
                    <input placeholder="Icon URL (.png / .svg)" required value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full bg-black p-4 border border-zinc-700 rounded-xl focus:border-yellow-500 outline-none"/>
                    <textarea placeholder="Describe how to earn this badge..." required value={form.quest} onChange={e => setForm({...form, quest: e.target.value})} className="w-full bg-black p-4 border border-zinc-700 rounded-xl h-24 focus:border-yellow-500 outline-none"/>
                    
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Logic Conditions (JSON)</label>
                        <textarea value={form.conditions} onChange={e => setForm({...form, conditions: e.target.value})} className="w-full bg-zinc-950 p-4 border border-zinc-800 rounded-xl h-56 font-mono text-sm text-green-400 focus:border-green-500 outline-none"/>
                        <p className="text-[10px] text-zinc-600 mt-2 italic">Types: total_pages, books_read, streak_days. Operations: {">="}, ==, includes.</p>
                    </div>

                    <div className="flex gap-3">
                        <button className={`flex-1 p-4 rounded-xl font-bold flex items-center justify-center gap-2 ${editId ? 'bg-blue-600' : 'bg-yellow-600 text-black'}`}>
                            {editId ? <><FaSync /> Update</> : <><FaSave /> Save Badge</>}
                        </button>
                        {editId && <button type="button" onClick={reset} className="px-6 bg-zinc-800 rounded-xl">Cancel</button>}
                    </div>
                </form>
            </div>

            {/* GALLERY */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zinc-400 mb-4">Existing Rewards ({data?.getBadges.length})</h2>
                <div className="grid grid-cols-1 gap-4">
                    {data?.getBadges.map((badge) => (
                        <div key={badge.Id} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 flex justify-between items-center hover:bg-zinc-900 transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-black rounded-xl">
                                    <img src={badge.Image} className="w-12 h-12 object-contain" alt="reward"/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-yellow-500">{badge.Label}</h3>
                                    <p className="text-sm text-zinc-500 italic">"{badge.Quest}"</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleEdit(badge)} className="p-3 text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-full transition-all"><FaEdit /></button>
                                <button onClick={async () => { if(confirm("Permanently delete reward?")) { await removeBadge({variables:{id: badge.Id}}); refetch(); }}} className="p-3 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"><FaTrash /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}