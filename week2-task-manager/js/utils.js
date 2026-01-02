// Small helper utilities used across the app

(function (global) {
    function $(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function $all(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function createId() {
        return Date.now().toString(36) + Math.random().toString(16).slice(2);
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function formatDate(dateStr) {
        if (!dateStr) return "No due date";
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return "No due date";
        return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
    }

    function isOverdue(dateStr) {
        if (!dateStr) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const d = new Date(dateStr);
        d.setHours(0, 0, 0, 0);
        return d < today;
    }

    global.Utils = {
        $: $, 
        $all: $all,
        createId: createId,
        escapeHtml: escapeHtml,
        formatDate: formatDate,
        isOverdue: isOverdue
    };
})(window);
